import { Resend } from "resend";
import { InviteEmailTemplate } from "./sendInviteTemplate";

const resendMail = new Resend(process.env.RESEND_API_KEY!);

export async function sendInviteEmail(
  email: string,
  name: string,
  inviteLink: string,
) {
  const from = process.env.RESEND_FROM_EMAIL!;

  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn(
      "RESEND_FROM_EMAIL is not defined. Using fallback: onboarding@resend.dev",
    );
  }

  await resendMail.emails.send({
    from,
    to: email,
    subject: "You're Invited to Join Our Workspace",
    html: InviteEmailTemplate({ name, inviteLink }),
  });
}
