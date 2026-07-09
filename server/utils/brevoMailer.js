// ----------------------------------------------------
// Brevo Email via HTTP API
// ----------------------------------------------------
// Render (and many other PaaS hosts) block or throttle outbound SMTP
// ports (587/465) on free/starter tiers, which is why OTP emails that
// worked locally were failing/timing out once deployed. Brevo's REST
// API sends over normal HTTPS (443), so it isn't affected by that.
//
// Requires BREVO_API_KEY in the environment (Brevo dashboard ->
// Settings -> API Keys -> Generate a new API key). This is different
// from the old BREVO_SMTP_KEY.
// ----------------------------------------------------

const BREVO_SENDER_EMAIL = 'vidyadalavi4475@gmail.com';
const BREVO_SENDER_NAME = 'Styron TSM';

export async function sendBrevoEmail({ to, subject, html }) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not set');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Brevo API error (${response.status}): ${errBody}`);
  }

  return response.json();
}

export async function sendOtpEmail(to, code) {
  return sendBrevoEmail({
    to,
    subject: 'Styron TSM Login OTP',
    html: `
      <div style="font-family:Arial;padding:30px">
      <h2>Styron TSM</h2>
      <p>Your login OTP is:</p>
      <h1>${code}</h1>
      <p>Valid for 5 minutes.</p>
      </div>
    `,
  });
}