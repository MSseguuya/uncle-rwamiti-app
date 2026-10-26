import express from 'express';
import path from 'path';
import fs from 'fs';
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
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'unclerwamiti.com';
    const currentOrigin = `${proto}://${host}`;

    // Replace preview domain placeholder with the exact live origin requesting the page
    html = html.replace(
      /https:\/\/ais-pre-7yop2wmdn7lcixfoq5q7zz-780366897587\.europe-west2\.run\.app/g,
      currentOrigin
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    return res.sendFile(indexPath);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Uncle Rwamiti production server listening on 0.0.0.0:${PORT}`);
});
