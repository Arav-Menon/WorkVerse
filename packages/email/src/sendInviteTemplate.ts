export function InviteEmailTemplate({
    name,
    inviteLink,
}: {
    name: string;
    inviteLink: string;
}) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
              <tr>
                <td style="padding: 40px 32px;">
                  <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 700; color: #0f172a; text-align: center;">You're Invited!</h1>
                  <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">Hello <strong>${name}</strong>,</p>
                  <p style="margin: 0 0 32px; font-size: 16px; line-height: 24px; color: #475569;">You've been invited to join <strong>WorkVerse</strong>. We're excited to have you on board! Click the button below to accept your invitation and get started.</p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${inviteLink}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; background-color: #0f172a; text-decoration: none; border-radius: 8px; transition: background-color 0.2s;">Join Workspace</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 32px 0 0; font-size: 14px; line-height: 20px; color: #94a3b8; text-align: center;">If you didn't expect this invitation, you can safely ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 32px; background-color: #f1f5f9; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} WorkVerse. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}