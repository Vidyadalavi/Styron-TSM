import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
// Verify once at startup so config problems show up immediately in the logs.
transporter.verify((error) => {
  if (error) {
    console.error('❌ Gmail Error:', error);
  } else {
    console.log('✅ Gmail is ready.');
  }
});

export async function sendQuotationEmail(quotation) {
  if (!quotation.email) return; // nothing to send if only a phone was given

  const rowsHtml = quotation.lineItems.map(it => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd">${it.title}</td>
      <td style="padding:8px;border:1px solid #ddd">${it.qty}</td>
      <td style="padding:8px;border:1px solid #ddd">₹${it.price.toLocaleString('en-IN')}</td>
      <td style="padding:8px;border:1px solid #ddd">₹${it.amount.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family:Arial;padding:24px;max-width:600px;margin:0 auto">
      <h2>Styron™ TSM</h2>
      <p>Hi ${quotation.fullName},</p>
      <p>Thanks for your quotation request. Here are the details:</p>
      <p><strong>Quotation No:</strong> ${quotation.quoteNumber}</p>
      ${quotation.lineItems.length > 0 ? `
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Product</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Rate</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Amount</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <p><strong>Subtotal:</strong> ₹${quotation.subtotal.toLocaleString('en-IN')}<br/>
        <strong>GST:</strong> ₹${quotation.gst.toLocaleString('en-IN')}<br/>
        <strong>Total:</strong> ₹${quotation.total.toLocaleString('en-IN')}</p>
      ` : ''}
      ${quotation.message ? `<p><strong>Message:</strong> ${quotation.message}</p>` : ''}
      <p>Our team will get back to you within 24 hours.</p>
      <p>— Styron TSM, Pune, Maharashtra</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Styron TSM" <${process.env.GMAIL_USER}>`,
    to: quotation.email,
    subject: `Your Styron TSM Quotation ${quotation.quoteNumber}`,
    html,
  });
}

// ----------------------------------------------------
// Sends the admin's reply to a contact-form message back to the customer.
// Used by PUT /api/messages/:id/reply
// ----------------------------------------------------
export async function sendMessageReplyEmail(message) {
  if (!message.email) return; // customer only left a phone number — nothing to email

  const html = `
    <div style="font-family:Arial;padding:24px;max-width:600px;margin:0 auto">
      <h2>Styron™ TSM</h2>
      <p>Hi ${message.name},</p>
      <p>Thanks for reaching out. Here's our reply to your message:</p>
      <blockquote style="margin:0 0 16px;padding:12px 16px;background:#f4f4f4;border-left:3px solid #EA580C;color:#555">
        ${message.body}
      </blockquote>
      <p>${message.reply}</p>
      <p>— Styron TSM, Pune, Maharashtra</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Styron TSM" <${process.env.GMAIL_USER}>`,
    to: message.email,
    subject: `Re: ${message.subject}`,
    html,
  });
}