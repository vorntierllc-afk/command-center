import { NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie } from "@/lib/server/session";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "Invalid credentials." }, { status: 401 });
    }

    setSessionCookie({ userId: data.user.id, email: data.user.email || body.email });
    return NextResponse.json({ user: data.user, session: data.session });
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
