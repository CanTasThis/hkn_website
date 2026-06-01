'use strict';

// Vercel Serverless Function — Contact Form
// Rate limiting is handled by Vercel's edge network

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  // Validation
  if (!name || !name.trim())
    return res.status(422).json({ error: 'Ad soyad zorunludur.' });
  if (name.trim().length > 100)
    return res.status(422).json({ error: 'Ad soyad en fazla 100 karakter olabilir.' });
  if (!email || !EMAIL_RE.test(email.trim()))
    return res.status(422).json({ error: 'Geçerli bir e-posta adresi girin.' });
  if (!message || !message.trim())
    return res.status(422).json({ error: 'Mesaj zorunludur.' });
  if (message.trim().length > 2000)
    return res.status(422).json({ error: 'Mesaj en fazla 2000 karakter olabilir.' });

  // Send email if SMTP configured, otherwise log
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
        port:   Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from:    `"${name.trim()}" <${process.env.SMTP_USER}>`,
        to:      process.env.CONTACT_TO || 'studio@hakanustun.com',
        replyTo: email.trim(),
        subject: subject ? `[HKN.com] ${subject}` : '[HKN.com] Yeni İletişim Mesajı',
        text:    `Ad: ${name.trim()}\nE-posta: ${email.trim()}\n\n${message.trim()}`,
      });
    } catch (err) {
      console.error('Mail gönderilemedi:', err.message);
      return res.status(500).json({ error: 'Mesajınız gönderilemedi. Lütfen doğrudan e-posta ile ulaşın.' });
    }
  } else {
    console.log('[İletişim]', { name: name.trim(), email: email.trim(), subject, ts: new Date().toISOString() });
  }

  return res.status(200).json({ success: true });
}
