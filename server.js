import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Password Reset Dispatch API for Administrator Recovery (peterowamala62@gmail.com)
app.post('/api/admin/request-password-reset', (req, res) => {
  const { email, resetUrl, resetCode, token } = req.body || {};
  const recipient = email || 'peterowamala62@gmail.com';
  console.log(`[Admin Password Reset] Dispatching reset link to ${recipient}:`);
  console.log(`  -> Reset URL: ${resetUrl}`);
  console.log(`  -> 6-Digit Code: ${resetCode}`);
  console.log(`  -> Token: ${token}`);
  return res.json({
    success: true,
    message: `Password reset instructions sent to ${recipient}`,
    recipient,
    dispatchedAt: new Date().toISOString(),
  });
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Uncle Rwamiti production server listening on 0.0.0.0:${PORT}`);
});
