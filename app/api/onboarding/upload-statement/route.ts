import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchant = await prisma.merchant.findFirst({ where: { userId: session.userId } });
  if (!merchant) {
    return NextResponse.json({ error: "Complete onboarding intake first." }, { status: 400 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  const admin = createSupabaseAdminClient();
  const uploadIds: string[] = [];

  for (const file of files.slice(0, 6)) {
    const storagePath = `${merchant.id}/${Date.now()}-${file.name}`;
    const fileUrl = admin
      ? await file.arrayBuffer().then(async (buffer) => {
          const { error } = await admin.storage.from("statement-uploads").upload(storagePath, Buffer.from(buffer), {
            contentType: file.type,
            upsert: false
          });
          if (error) throw error;
          return storagePath;
        }).catch(() => storagePath)
      : storagePath;

    const upload = await prisma.statementUpload.create({
      data: {
        merchantId: merchant.id,
        fileName: file.name,
        fileType: file.type.includes("pdf") ? "pdf" : "csv",
        fileUrl
      }
    });
    uploadIds.push(upload.id);
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      onboardMethod: "upload",
      processingStatus: "processing"
    }
  });

  return NextResponse.json({ upload_ids: uploadIds, status: "processing" });
}
