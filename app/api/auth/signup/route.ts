import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { setSessionCookie } from "@/lib/server/session";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  business_name: z.string().min(2),
  plan: z.string().default("starter")
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id || crypto.randomUUID();
    await prisma.user.upsert({
      where: { email: body.email },
      update: {
        businessName: body.business_name,
        plan: body.plan
      },
      create: {
        id: userId,
        email: body.email,
        businessName: body.business_name,
        plan: body.plan
      }
    });

    setSessionCookie({ userId, email: body.email });

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("signup error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
