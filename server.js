'use strict';

require('dotenv').config();

const express      = require('express');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const compression  = require('compression');
const path         = require('path');
const nodemailer   = require('nodemailer');
const { body, validationResult } = require('express-validator');

const app  = express();
const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === 'production';

/* ============================================================
   HTTPS redirect (production only)
   ============================================================ */
if (PROD) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

/* ============================================================
   Security headers — helmet
   Babel standalone requires 'unsafe-eval'; once JSX is
   pre-compiled this can be removed for a stricter policy.
   ============================================================ */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'"],
        styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
        imgSrc:      ["'self'", 'data:', 'https://images.unsplash.com'],
        connectSrc:  ["'self'"],
        frameSrc:    ["'none'"],
        objectSrc:   ["'none'"],
        baseUri:     ["'self'"],
        formAction:  ["'self'"],
        upgradeInsecureRequests: PROD ? [] : null,
      },
    },
    hsts: PROD
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
  })
);

/* ============================================================
   Gzip compression
   ============================================================ */
app.use(compression());

/* ============================================================
   Body parsing — size-capped to prevent DoS
   ============================================================ */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

/* ============================================================
   Rate limiting
   ============================================================ */
// Global: 200 requests / 15 min per IP
app.use(
  rateLimit({
    windowMs:        15 * 60 * 1000,
    max:             200,
    standardHeaders: true,
    legacyHeaders:   false,
    message:         { error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' },
  })
);

// Contact form: 5 submissions / hour per IP
const contactLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Çok fazla form gönderimi. Lütfen bir saat sonra tekrar deneyin.' },
});

/* ============================================================
   Mail transporter (configure via .env)
   ============================================================ */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ============================================================
   API — contact form
   ============================================================ */
const contactValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Ad soyad zorunludur.')
    .isLength({ max: 100 }).withMessage('Ad soyad en fazla 100 karakter olabilir.')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur.')
    .isEmail().withMessage('Geçerli bir e-posta adresi girin.')
    .normalizeEmail(),
  body('subject')
    .trim()
    .optional()
    .isLength({ max: 200 }).escape(),
  body('message')
    .trim()
    .notEmpty().withMessage('Mesaj zorunludur.')
    .isLength({ max: 2000 }).withMessage('Mesaj en fazla 2000 karakter olabilir.')
    .escape(),
];

app.post('/api/contact', contactLimiter, contactValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  const { name, email, subject, message } = req.body;

  // Only attempt email if SMTP credentials are configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await transporter.sendMail({
        from:    `"${name}" <${process.env.SMTP_USER}>`,
        to:      process.env.CONTACT_TO || 'studio@hakanustun.com',
        replyTo: email,
        subject: subject ? `[HKN.com] ${subject}` : '[HKN.com] Yeni İletişim Mesajı',
        text:    `Ad: ${name}\nE-posta: ${email}\n\n${message}`,
      });
    } catch (err) {
      console.error('Mail gönderilemedi:', err.message);
      // Don't expose SMTP errors to client
      return res.status(500).json({ error: 'Mesajınız gönderilemedi. Lütfen doğrudan e-posta ile ulaşın.' });
    }
  } else {
    // Dev mode: log to console
    console.log('[İletişim Formu]', { name, email, subject, timestamp: new Date().toISOString() });
  }

  res.json({ success: true });
});

/* ============================================================
   Static files
   Cache: 1 day for assets, no-cache for HTML
   ============================================================ */
app.use(
  express.static(path.join(__dirname), {
    index:        'Hakan Üstün - Site.html',
    dotfiles:     'allow',   // serve .image-slots.state.json
    maxAge:       '1d',
    etag:         true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      if (filePath.endsWith('.json')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

/* ============================================================
   Catch-all — serve main HTML for direct URL access
   ============================================================ */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'Hakan Üstün - Site.html'));
});

/* ============================================================
   404 / Error handlers
   ============================================================ */
app.use((_req, res) => {
  res.status(404).json({ error: 'Sayfa bulunamadı.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  // Never expose stack traces to clients
  res.status(500).json({ error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.' });
});

/* ============================================================
   Start
   ============================================================ */
app.listen(PORT, () => {
  console.log(`✓ Sunucu çalışıyor → http://localhost:${PORT}`);
  console.log(`  Mod: ${PROD ? 'production' : 'development'}`);
  if (!process.env.SMTP_USER) {
    console.log('  Not: SMTP ayarlanmadı — form gönderileri konsola yazılacak.');
  }
});
