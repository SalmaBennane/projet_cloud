require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3001;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

const emailHistory = [];

function addToHistory(type, recipient, status, error = null) {
  emailHistory.unshift({
    id: Date.now().toString(),
    type, recipient, status, error,
    timestamp: new Date().toISOString(),
  });
}

function validateRequired(fields, body) {
  return fields.filter((f) => !body[f]);
}

// ── TEMPLATES ────────────────────────────────────────────

function buildWelcomeEmail({ name, email, serviceName }) {
  return {
    to: email,
    from: { email: process.env.FROM_EMAIL, name: process.env.FROM_NAME || 'Mon App' },
    subject: `Bienvenue sur ${serviceName} !`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:40px;background:#f9f9f9;border-radius:12px;">
        <h1 style="color:#1a1a2e;">Bonjour ${name} 👋</h1>
        <p style="color:#444;font-size:16px;line-height:1.6;">
          Votre compte sur <strong>${serviceName}</strong> a bien été créé. Bienvenue !
        </p>
        <p style="color:#888;font-size:14px;">L'équipe ${serviceName}</p>
      </div>
    `,
    text: `Bonjour ${name},\n\nVotre compte sur ${serviceName} a été créé.\n\nBienvenue !`,
  };
}

function buildNotificationEmail({ email, name, message, action }) {
  const actionButton = action
    ? `<a href="${action.url}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#6c63ff;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${action.label}</a>`
    : '';
  return {
    to: email,
    from: { email: process.env.FROM_EMAIL, name: process.env.FROM_NAME || 'Mon App' },
    subject: `Notification pour ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:40px;background:#f9f9f9;border-radius:12px;">
        <h2 style="color:#1a1a2e;">Bonjour ${name},</h2>
        <p style="color:#444;font-size:16px;line-height:1.6;">${message}</p>
        ${actionButton}
      </div>
    `,
    text: `Bonjour ${name},\n\n${message}${action ? `\n\n${action.label}: ${action.url}` : ''}`,
  };
}

function buildAlertEmail({ adminEmail, service, severity, description }) {
  const colors = { Info: '#3b82f6', Warning: '#f59e0b', Critical: '#ef4444' };
  const icons  = { Info: 'ℹ️', Warning: '⚠️', Critical: '🚨' };
  const color  = colors[severity] || '#6b7280';
  const icon   = icons[severity]  || '📢';
  return {
    to: adminEmail,
    from: { email: process.env.FROM_EMAIL, name: process.env.FROM_NAME || 'Mon App' },
    subject: `${icon} [${severity}] Alerte système — ${service}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:40px;background:#f9f9f9;border-radius:12px;">
        <h2 style="color:#1a1a2e;">${icon} Alerte Système —
          <span style="color:${color};">${severity}</span>
        </h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
          <tr style="background:#f3f4f6;">
            <td style="padding:12px 16px;font-weight:600;color:#555;width:140px;">Service</td>
            <td style="padding:12px 16px;">${service}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-weight:600;color:#555;">Gravité</td>
            <td style="padding:12px 16px;color:${color};font-weight:700;">${severity}</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td style="padding:12px 16px;font-weight:600;color:#555;">Description</td>
            <td style="padding:12px 16px;">${description}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-weight:600;color:#555;">Horodatage</td>
            <td style="padding:12px 16px;color:#666;">${new Date().toLocaleString('fr-FR')}</td>
          </tr>
        </table>
      </div>
    `,
    text: `[${severity}] Alerte sur ${service}\n\n${description}\n\n${new Date().toLocaleString('fr-FR')}`,
  };
}

// ── ROUTES ───────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', sendgrid: !!process.env.SENDGRID_API_KEY, timestamp: new Date().toISOString() });
});

app.get('/api/history', (req, res) => {
  const total   = emailHistory.length;
  const success = emailHistory.filter((e) => e.status === 'success').length;
  const failed  = emailHistory.filter((e) => e.status === 'error').length;
  res.json({ history: emailHistory, stats: { total, success, failed } });
});

app.post('/api/send/welcome', async (req, res) => {
  const missing = validateRequired(['name', 'email', 'serviceName'], req.body);
  if (missing.length) return res.status(400).json({ error: `Champs manquants: ${missing.join(', ')}` });
  const { name, email, serviceName } = req.body;
  try {
    await sgMail.send(buildWelcomeEmail({ name, email, serviceName }));
    addToHistory('Inscription', email, 'success');
    res.json({ success: true, message: `Email de bienvenue envoyé à ${email}` });
  } catch (err) {
    const msg = err.response?.body?.errors?.[0]?.message || err.message;
    addToHistory('Inscription', email, 'error', msg);
    res.status(500).json({ error: 'Échec de l\'envoi', detail: msg });
  }
});

app.post('/api/send/notification', async (req, res) => {
  const missing = validateRequired(['email', 'name', 'message'], req.body);
  if (missing.length) return res.status(400).json({ error: `Champs manquants: ${missing.join(', ')}` });
  const { email, name, message, action } = req.body;
  try {
    await sgMail.send(buildNotificationEmail({ email, name, message, action }));
    addToHistory('Notification', email, 'success');
    res.json({ success: true, message: `Notification envoyée à ${email}` });
  } catch (err) {
    const msg = err.response?.body?.errors?.[0]?.message || err.message;
    addToHistory('Notification', email, 'error', msg);
    res.status(500).json({ error: 'Échec de l\'envoi', detail: msg });
  }
});

app.post('/api/send/alert', async (req, res) => {
  const missing = validateRequired(['adminEmail', 'service', 'severity', 'description'], req.body);
  if (missing.length) return res.status(400).json({ error: `Champs manquants: ${missing.join(', ')}` });
  const { adminEmail, service, severity, description } = req.body;
  if (!['Info', 'Warning', 'Critical'].includes(severity))
    return res.status(400).json({ error: 'Gravité invalide. Valeurs: Info | Warning | Critical' });
  try {
    await sgMail.send(buildAlertEmail({ adminEmail, service, severity, description }));
    addToHistory('Alerte', adminEmail, 'success');
    res.json({ success: true, message: `Alerte envoyée à ${adminEmail}` });
  } catch (err) {
    const msg = err.response?.body?.errors?.[0]?.message || err.message;
    addToHistory('Alerte', adminEmail, 'error', msg);
    res.status(500).json({ error: 'Échec de l\'envoi', detail: msg });
  }
});

// ── DÉMARRAGE ────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📬 SendGrid: ${process.env.SENDGRID_API_KEY ? '✅ Configuré' : '❌ Clé manquante'}`);
  console.log(`📨 From: ${process.env.FROM_EMAIL || '❌ FROM_EMAIL manquant'}\n`);
});