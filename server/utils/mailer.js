import { sendBrevoEmail } from './brevoMailer.js';

// ----------------------------------------------------
// Quotation + reply emails, sent via Brevo's HTTP API.
//
// Previously these went through Gmail SMTP (nodemailer, port 587), which is
// blocked/throttled on Render (and most PaaS hosts) — the same issue the
// OTP emails hit before being switched to Brevo. Routing these through
// sendBrevoEmail (HTTPS) fixes that, and keeps all outbound mail on one
// provider. Only BREVO_API_KEY is required now — GMAIL_USER /
// GMAIL_APP_PASSWORD are no longer needed.
// ----------------------------------------------------

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

  await sendBrevoEmail({
    to: quotation.email,
    subject: `Your Styron TSM Quotation ${quotation.quoteNumber}`,
    html,
  });
}

// ----------------------------------------------------
// Order confirmation email, sent right after checkout.
// Used by POST /api/orders
// ----------------------------------------------------
export async function sendOrderConfirmationEmail(order) {
  if (!order.email) return; // nothing to send without an address

const rowsHtml = order.lineItems.map(it => {
  const qty = it.qty ?? 1;
  const price = it.price ?? 0;
  const amount = it.amount ?? price * qty;
  const label = it.title || it.productId || 'Item';
    return `
    <tr>
      <td style="padding:8px;border:1px solid #ddd">${label}</td>
      <td style="padding:8px;border:1px solid #ddd">${qty}</td>
      <td style="padding:8px;border:1px solid #ddd">₹${price.toLocaleString('en-IN')}</td>
      <td style="padding:8px;border:1px solid #ddd">₹${amount.toLocaleString('en-IN')}</td>
    </tr>
  `;
  }).join('');

  const html = `
    <div style="font-family:Arial;padding:24px;max-width:600px;margin:0 auto">
      <h2>Styron™ TSM</h2>
      <p>Hi ${order.fullName},</p>
      <p>Thanks for your order! Here's your confirmation:</p>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      ${order.lineItems.length > 0 ? `
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
        <p><strong>Subtotal:</strong> ₹${order.subtotal.toLocaleString('en-IN')}<br/>
        <strong>GST:</strong> ₹${order.gst.toLocaleString('en-IN')}<br/>
        <strong>Delivery:</strong> ₹${order.delivery.toLocaleString('en-IN')}<br/>
        <strong>Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
      ` : ''}
      <p><strong>Shipping to:</strong><br/>
      ${order.address}, ${order.city}${order.state ? `, ${order.state}` : ''}${order.pincode ? ` - ${order.pincode}` : ''}</p>
      <p>We'll notify you again once your order ships.</p>
      <p>— Styron TSM, Pune, Maharashtra</p>
    </div>
  `;

  await sendBrevoEmail({
    to: order.email,
    subject: `Your Styron TSM Order ${order.orderId} is confirmed`,
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

  await sendBrevoEmail({
    to: message.email,
    subject: `Re: ${message.subject}`,
    html,
  });
}