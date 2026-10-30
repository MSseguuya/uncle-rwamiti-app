const sharp = require('sharp');
const fs = require('fs');

async function testEllipses() {
  const inputPath = 'public/assets/comic-pages/my-son-does-not-work-here/page-2.jpg';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const mask = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;

      // Left ellipse: center (245, 125), rx = 165, ry = 75
      const dLeft = Math.pow((x - 245) / 168, 2) + Math.pow((y - 125) / 78, 2);
      if (dLeft <= 1.0) {
        mask[idx] = 1;
      }
      // Left tail
      if (x >= 320 && x <= 405 && y >= 170 && y <= 245) {
        // Line from (330, 180) to (395, 235)
        if (x > 330 && y < 240) {
          const bIdx = idx * channels;
          const r = data[bIdx], g = data[bIdx+1], b = data[bIdx+2];
          if (r > 180 && g > 180 && b > 180) {
            mask[idx] = 1;
          }
        }
      }

      // Right ellipse: center (875, 215), rx = 205, ry = 88
      const dRight = Math.pow((x - 875) / 208, 2) + Math.pow((y - 215) / 90, 2);
      if (dRight <= 1.0) {
        mask[idx] = 1;
      }
      // Right tail: down towards Grace
      if (x >= 780 && x <= 850 && y >= 280 && y <= 350) {
        const bIdx = idx * channels;
        const r = data[bIdx], g = data[bIdx+1], b = data[bIdx+2];
        if (r > 150 && g > 150 && b > 150) {
          mask[idx] = 1;
        }
      }

      // P02 badge bottom right
      if (x >= 1050 && x <= 1165 && y >= 1375 && y <= 1455) {
        const bIdx = idx * channels;
        const r = data[bIdx], g = data[bIdx+1], b = data[bIdx+2];
        if ((r > 180 && g > 180 && b > 180) || (r < 100 && g < 100 && b < 100)) {
          mask[idx] = 1;
        }
      }
    }
  }

  // Dilate mask by 4 pixels to cover all border anti-aliasing
  const dilated = new Uint8Array(mask);
  for (let iter = 0; iter < 4; iter++) {
    const temp = new Uint8Array(dilated);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (temp[y * width + x] === 1) {
          dilated[(y - 1) * width + x] = 1;
          dilated[(y + 1) * width + x] = 1;
          dilated[y * width + (x - 1)] = 1;
          dilated[y * width + (x + 1)] = 1;
        }
      }
    }
  }

  // Harmonic relaxation
  const rGrid = new Float32Array(width * height);
  const gGrid = new Float32Array(width * height);
  const bGrid = new Float32Array(width * height);

  for (let i = 0; i < width * height; i++) {
    rGrid[i] = data[i * channels];
    gGrid[i] = data[i * channels + 1];
    bGrid[i] = data[i * channels + 2];
  }

  for (let iter = 0; iter < 300; iter++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (dilated[idx] === 1) {
          rGrid[idx] = 0.25 * (rGrid[idx - 1] + rGrid[idx + 1] + rGrid[idx - width] + rGrid[idx + width]);
          gGrid[idx] = 0.25 * (gGrid[idx - 1] + gGrid[idx + 1] + gGrid[idx - width] + gGrid[idx + width]);
          bGrid[idx] = 0.25 * (bGrid[idx - 1] + bGrid[idx + 1] + bGrid[idx - width] + bGrid[idx + width]);
        }
      }
    }
  }

  const outData = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (dilated[idx] === 1) {
        const bIdx = idx * channels;
        const grain = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1) * 3 - 1.5;
        outData[bIdx] = Math.min(255, Math.max(0, Math.round(rGrid[idx] + grain)));
        outData[bIdx + 1] = Math.min(255, Math.max(0, Math.round(gGrid[idx] + grain)));
        outData[bIdx + 2] = Math.min(255, Math.max(0, Math.round(bGrid[idx] + grain)));
      }
    }
  }

  // Soft bokeh blur in background
  const fgMask = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (y >= 410) { fgMask[idx] = 1.0; continue; }
      if (x >= 390 && x <= 560 && y >= 45 && y <= 410) { fgMask[idx] = 1.0; continue; }
      if (x >= 50 && x <= 390 && y >= 265 && y <= 410) { fgMask[idx] = 1.0; continue; }
      if (x >= 690 && x <= 980 && y >= 310 && y <= 410) { fgMask[idx] = 1.0; continue; }
      if (y < 40) { fgMask[idx] = 0.2; continue; }
      fgMask[idx] = 0.0;
    }
  }

  // Smooth mask
  const smoothFg = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0, count = 0;
      for (let dy = -10; dy <= 10; dy += 2) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -10; dx <= 10; dx += 2) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          sum += fgMask[ny * width + nx];
          count++;
        }
      }
      smoothFg[y * width + x] = sum / count;
    }
  }

  const blurred = await sharp(outData, { raw: { width, height, channels } })
    .blur(14)
    .raw()
    .toBuffer();

  const finalComposite = Buffer.from(outData);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const bIdx = idx * channels;
      const fgWeight = smoothFg[idx];
      const bgWeight = 1.0 - fgWeight;
      if (bgWeight > 0.001) {
        const grain = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1) * 3 - 1.5;
        finalComposite[bIdx] = Math.min(255, Math.max(0, Math.round(outData[bIdx] * fgWeight + (blurred[bIdx] + grain) * bgWeight)));
        finalComposite[bIdx + 1] = Math.min(255, Math.max(0, Math.round(outData[bIdx + 1] * fgWeight + (blurred[bIdx + 1] + grain) * bgWeight)));
        finalComposite[bIdx + 2] = Math.min(255, Math.max(0, Math.round(outData[bIdx + 2] * fgWeight + (blurred[bIdx + 2] + grain) * bgWeight)));
      }
    }
  }

  const finalWebp = await sharp(finalComposite, { raw: { width, height, channels } })
    .extract({ left: 85, top: 0, width: 980, height: 1460 })
    .resize(1024, 1536, { fit: 'cover' })
    .modulate({
      brightness: 1.0,
      saturation: 1.05,
    })
    .webp({ quality: 95 })
    .toBuffer();

  fs.writeFileSync('public/cover-my-son-does-not-work-here.webp', finalWebp);
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/cover-my-son-does-not-work-here.webp', finalWebp);
  }
  console.log('Done testEllipses!');
}

testEllipses().catch(console.error);
