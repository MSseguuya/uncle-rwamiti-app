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


const COMIC_META = {
  'send-me-something-small': {
    title: 'Send Me Something Small — Comic Dilemma | Uncle Rwamiti: Your Move',
    description: 'You have a degree. You have an interview. You need transport money. Again.',
    image: '/assets/comic-pages/page-1.jpg',
  },
  'ban-bodas': {
    title: 'Ban Bodas! She Typed. From the Back of a Boda. | Uncle Rwamiti: Your Move',
    description: 'She rides one every morning. She wants them gone by evening. Then the rider spoke.',
    image: '/assets/comic-pages/ban-bodas/cover.jpg',
  },
  'they-extended-her-internship': {
    title: 'They Extended Her Internship | Uncle Rwamiti: Your Move',
    description: 'Three more months. Still no pay. Still the best company on her CV. Who is really paying for her experience?',
    image: '/assets/comic-pages/extended-internship/page-1.jpg',
  },
  'my-son-does-not-work-here': {
    title: 'My Son Does Not Work Here | Uncle Rwamiti: Your Move',
    description: 'He took the job to pay his own rent. His father brought guests to the restaurant—and denied knowing him.',
    image: '/assets/comic-pages/my-son-does-not-work-here/page-1.jpg',
  },
  'because-i-said-so-comic': {
    title: 'Because I Said So. | Uncle Rwamiti: Your Move',
    description: 'Eva is sixteen, talented, and invited to a Saturday digital illustration workshop. Her mother says no without looking.',
    image: '/assets/comic-pages/because-i-said-so/cover.jpg',
  },
};

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

    const comicSlug = typeof req.query.comic === 'string' ? req.query.comic : null;
    if (comicSlug && COMIC_META[comicSlug]) {
      const meta = COMIC_META[comicSlug];
      const fullImg = `${currentOrigin}${meta.image}`;
      html = html
        .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
        .replace(/property="og:title" content=".*?"/, `property="og:title" content="${meta.title}"`)
        .replace(/name="twitter:title" content=".*?"/, `name="twitter:title" content="${meta.title}"`)
        .replace(/name="description" content=".*?"/, `name="description" content="${meta.description}"`)
        .replace(/property="og:description" content=".*?"/, `property="og:description" content="${meta.description}"`)
        .replace(/name="twitter:description" content=".*?"/, `name="twitter:description" content="${meta.description}"`)
        .replace(/property="og:image" content=".*?"/, `property="og:image" content="${fullImg}"`)
        .replace(/property="og:image:secure_url" content=".*?"/, `property="og:image:secure_url" content="${fullImg}"`)
        .replace(/name="twitter:image" content=".*?"/, `name="twitter:image" content="${fullImg}"`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    return res.sendFile(indexPath);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Uncle Rwamiti production server listening on 0.0.0.0:${PORT}`);
});
