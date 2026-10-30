const sharp = require('sharp');
const fs = require('fs');

async function buildMasterpiece() {
  const inputPath = 'public/assets/comic-pages/my-son-does-not-work-here/page-2.jpg';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const mask = new Uint8Array(width * height);

  // 1. Precise Left Bubble detection (y: 90..282, x: 80..455)
  const leftWhite = new Uint8Array(width * height);
  for (let y = 90; y <= 282; y++) {
    for (let x = 80; x <= 455; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 200 && g > 200 && b > 200) {
        leftWhite[y * width + x] = 1;
      }
    }
  }

  // Row-wise bridge inside left bubble (connects text and white interior)
  for (let y = 90; y <= 282; y++) {
    let minX = -1, maxX = -1;
    for (let x = 80; x <= 455; x++) {
      if (leftWhite[y * width + x]) {
        if (minX === -1) minX = x;
        maxX = x;
      }
    }
    if (minX !== -1) {
      for (let x = minX; x <= maxX; x++) {
        mask[y * width + x] = 1;
      }
    }
  }

  // 2. Precise Right Bubble detection (y: 205..480, x: 715..1085)
  const rightWhite = new Uint8Array(width * height);
  for (let y = 205; y <= 480; y++) {
    for (let x = 715; x <= 1085; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 200 && g > 200 && b > 200) {
        rightWhite[y * width + x] = 1;
      }
    }
  }

  // Row-wise bridge inside right bubble (including the tail down to y=475)
  for (let y = 205; y <= 480; y++) {
    let minX = -1, maxX = -1;
    for (let x = 715; x <= 1085; x++) {
      if (rightWhite[y * width + x]) {
        if (minX === -1) minX = x;
        maxX = x;
      }
    }
    if (minX !== -1) {
      for (let x = minX; x <= maxX; x++) {
        mask[y * width + x] = 1;
      }
    }
  }

  // 3. Dilate mask by 7 pixels to fully envelop black outline, antialiasing, and tail tips
  const dilatedMask = new Uint8Array(width * height);
  const DILATE = 7;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      for (let dy = -DILATE; dy <= DILATE; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -DILATE; dx <= DILATE; dx++) {
          if (dx * dx + dy * dy > DILATE * DILATE) continue;
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          dilatedMask[ny * width + nx] = 1;
        }
      }
    }
  }

  // Also mask the P02 badge at bottom right [1040..width, 1370..height]
  for (let y = 1370; y < height; y++) {
    for (let x = 1040; x < width; x++) {
      dilatedMask[y * width + x] = 2; // P02 badge
    }
  }

  let maskCount = 0;
  for (let i = 0; i < width * height; i++) {
    if (dilatedMask[i]) maskCount++;
  }
  console.log('Total masked pixels to inpaint:', maskCount);

  // 4. Inpainting with Dirichlet Harmonic Relaxation
  const rBuf = new Float32Array(width * height);
  const gBuf = new Float32Array(width * height);
  const bBuf = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * channels;
      rBuf[idx] = data[pIdx];
      gBuf[idx] = data[pIdx + 1];
      bBuf[idx] = data[pIdx + 2];
    }
  }

  // Seamless mirror for P02 badge
  for (let y = 1370; y < height; y++) {
    for (let x = 1040; x < width; x++) {
      const idx = y * width + x;
      const srcX = 1030 - (x - 1040);
      const srcIdx = y * width + srcX;
      rBuf[idx] = rBuf[srcIdx];
      gBuf[idx] = gBuf[srcIdx];
      bBuf[idx] = bBuf[srcIdx];
      dilatedMask[idx] = 0;
    }
  }

  // BFS nearest-boundary propagation
  console.log('Starting BFS nearest-boundary propagation...');
  const queue = [];
  const dist = new Int32Array(width * height).fill(-1);
  const nearestSrc = new Int32Array(width * height).fill(-1);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (dilatedMask[idx] === 1) continue;

      let isBoundary = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (dilatedMask[ny * width + nx] === 1) {
            isBoundary = true;
            break;
          }
        }
      }
      if (isBoundary) {
        dist[idx] = 0;
        nearestSrc[idx] = idx;
        queue.push(idx);
      }
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);
    const src = nearestSrc[curr];

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const nidx = ny * width + nx;
      if (dilatedMask[nidx] === 1 && dist[nidx] === -1) {
        dist[nidx] = dist[curr] + 1;
        nearestSrc[nidx] = src;
        rBuf[nidx] = rBuf[src];
        gBuf[nidx] = gBuf[src];
        bBuf[nidx] = bBuf[src];
        queue.push(nidx);
      }
    }
  }
  console.log('BFS initialization complete.');

  // 5. 400 Iterations of Laplace smoothing on the masked pixels
  console.log('Running 400 iterations of Laplace smoothing...');
  const rTemp = new Float32Array(rBuf);
  const gTemp = new Float32Array(gBuf);
  const bTemp = new Float32Array(bBuf);

  for (let iter = 0; iter < 400; iter++) {
    const srcR = iter % 2 === 0 ? rBuf : rTemp;
    const srcG = iter % 2 === 0 ? gBuf : gTemp;
    const srcB = iter % 2 === 0 ? bBuf : bTemp;
    const dstR = iter % 2 === 0 ? rTemp : rBuf;
    const dstG = iter % 2 === 0 ? gTemp : gBuf;
    const dstB = iter % 2 === 0 ? bTemp : bBuf;

    for (let y = 80; y <= 490; y++) {
      for (let x = 70; x <= 1100; x++) {
        const idx = y * width + x;
        if (dilatedMask[idx] !== 1) continue;

        const left = idx - 1;
        const right = idx + 1;
        const up = idx - width;
        const down = idx + width;

        dstR[idx] = 0.25 * (srcR[left] + srcR[right] + srcR[up] + srcR[down]);
        dstG[idx] = 0.25 * (srcG[left] + srcG[right] + srcG[up] + srcG[down]);
        dstB[idx] = 0.25 * (srcB[left] + srcB[right] + srcB[up] + srcB[down]);
      }
    }
  }

  const finalR = 400 % 2 === 0 ? rBuf : rTemp;
  const finalG = 400 % 2 === 0 ? gBuf : gTemp;
  const finalB = 400 % 2 === 0 ? bBuf : bTemp;

  // 6. Generate final image buffer with photographic grain
  const out = Buffer.alloc(width * height * channels);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * channels;

      if (dilatedMask[idx] === 1) {
        const grain = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) * 3.5 - 1.75;
        out[pIdx] = Math.min(255, Math.max(0, Math.round(finalR[idx] + grain)));
        out[pIdx + 1] = Math.min(255, Math.max(0, Math.round(finalG[idx] + grain)));
        out[pIdx + 2] = Math.min(255, Math.max(0, Math.round(finalB[idx] + grain)));
      } else {
        out[pIdx] = Math.round(finalR[idx]);
        out[pIdx + 1] = Math.round(finalG[idx]);
        out[pIdx + 2] = Math.round(finalB[idx]);
      }
    }
  }

  // 7. Crop & format to 1024 x 1536 (2:3 aspect ratio)
  // Perfectly framing Joel, David, Grace, Martin, Rwamiti
  const finalWebp = await sharp(out, { raw: { width, height, channels } })
    .extract({ left: 85, top: 0, width: 980, height: 1460 })
    .resize(1024, 1536, { fit: 'cover' })
    .modulate({
      brightness: 1.0,
      saturation: 1.04,
    })
    .webp({ quality: 95 })
    .toBuffer();

  fs.writeFileSync('public/cover-my-son-does-not-work-here.webp', finalWebp);
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/cover-my-son-does-not-work-here.webp', finalWebp);
  }
  console.log('FLAWLESS PRODUCTION COVER GENERATED!');
}

buildMasterpiece().catch(console.error);
