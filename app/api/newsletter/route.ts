import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/server/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email()
});

const WELCOME_HTML = (email: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Welcome to HighRiskIntel</title>
</head>
<body style="margin:0;padding:0;background:#07070A;font-family:'Inter',Helvetica,Arial,sans-serif;color:#F1F1F3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#07070A;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(37,99,235,0.15),rgba(129,140,248,0.08));padding:40px 48px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#3B82F6,#2563EB);display:inline-block;text-align:center;line-height:36px;font-weight:800;font-size:16px;color:#fff;">H</div>
                      <span style="font-size:18px;font-weight:700;color:#F1F1F3;letter-spacing:-0.5px;vertical-align:middle;margin-left:10px;">HighRiskIntel</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <h1 style="font-size:28px;font-weight:800;color:#F1F1F3;margin:0 0 16px;letter-spacing:-0.8px;line-height:1.2;">
                You&rsquo;re in. Welcome to the intel feed.
              </h1>
              <p style="font-size:15px;color:#8C8C9A;line-height:1.8;margin:0 0 28px;">
                You&rsquo;ll now receive the <strong style="color:#F1F1F3;">HighRiskIntel weekly brief</strong> — chargeback trends, processor news, risk strategy, and what high-risk merchants are doing to protect their MIDs right now.
              </p>

              <!-- What to expect -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.14);border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#3B82F6;margin:0 0 14px;">What you&rsquo;ll get</p>
                    ${[
                      "Weekly dispute ratio benchmarks by industry",
                      "MID termination warnings and processor news",
                      "Chargeback reason code analysis and tactics",
                      "Authorization rate trends and optimization tips",
                      "Exclusive risk intelligence from our analyst team"
                    ].map(item => `
                    <p style="font-size:13px;color:#8C8C9A;margin:0 0 10px;display:flex;align-items:flex-start;gap:8px;">
                      <span style="color:#22C55E;font-weight:700;flex-shrink:0;">✓</span> ${item}
                    </p>`).join("")}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%);border-radius:9px;">
                    <a href="https://highriskintel.com" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;letter-spacing:-0.01em;">
                      Visit your dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="font-size:12px;color:#55555F;margin:0 0 6px;">
                You&rsquo;re receiving this because <span style="color:#8C8C9A;">${email}</span> subscribed at highriskintel.com.
              </p>
              <p style="font-size:12px;color:#55555F;margin:0;">
                <a href="https://highriskintel.com" style="color:#3B82F6;text-decoration:none;">Unsubscribe</a> &nbsp;·&nbsp; HighRiskIntel, Inc.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    // Check for duplicate
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "You're already subscribed." }, { status: 200 });
    }

    // Save to DB
    await prisma.newsletterSubscriber.create({
      data: { email, source: body.source ?? "landing" }
    });

    // Send welcome email
    await resend.emails.send({
      from: "HighRiskIntel <newsletter@highriskintel.com>",
      to: email,
      subject: "You're in — HighRiskIntel weekly intel brief",
      html: WELCOME_HTML(email)
    });

    return NextResponse.json({ message: "Subscribed successfully." }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    console.error("Newsletter error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
