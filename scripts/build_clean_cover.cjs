const sharp = require('sharp');
const fs = require('fs');

async function buildFlawlessCinematicCover() {
  const inputPath = 'public/assets/comic-pages/my-son-does-not-work-here/page-2.jpg';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Mask: 1 = speech bubble / text / border to replace, 0 = keep original
  const mask = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;

      // 1. LEFT BUBBLE: "Good afternoon."
      // Ellipse: center (240, 135), rx = 155, ry = 65
      const inLeftEllipse = Math.pow((x - 240) / 158, 2) + Math.pow((y - 135) / 68, 2) <= 1.0;
      // Left tail pointing towards Joel's shoulder
      const inLeftTail = (x >= 325 && x <= 405 && y >= 170 && y <= 245 && (x - 325) * 0.9 + 170 <= y);

      if (inLeftEllipse || inLeftTail) {
        // Exclude Joel's body/arm
        if (!(x > 410 && y > 185)) {
          mask[idx] = 1;
        }
      }

      // 2. RIGHT BUBBLE: "David! Isn't this your boy?"
      // Ellipse: center (870, 215), rx = 245, ry = 85
      const inRightEllipse = Math.pow((x - 870) / 248, 2) + Math.pow((y - 215) / 88, 2) <= 1.0;
      // Right tail pointing down towards Grace's shoulder
      const inRightTail = (x >= 790 && x <= 840 && y >= 285 && y <= 355);

      if (inRightEllipse || inRightTail) {
        // Exclude Grace's hair
        if (!(y > 330 && x >= 720 && x <= 850)) {
          mask[idx] = 1;
        }
      }

      // 3. P02 badge bottom right
      if (x >= 1060 && x <= 1160 && y >= 1380 && y <= 1455) {
        mask[idx] = 1;
      }
    }
  }

  // Dilate mask by 5 pixels so NO black borders or anti-aliasing can remain
  let dilated = new Uint8Array(mask);
  for (let iter = 0; iter < 5; iter++) {
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

  // Protect people's crisp boundary pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      // Joel head/torso
      if (x >= 415 && x <= 550 && y >= 55 && y <= 300) dilated[idx] = 0;
      // David head
      if (x >= 80 && x <= 340 && y >= 285 && y <= 450) dilated[idx] = 0;
      // Grace head/hair
      if (x >= 720 && x <= 960 && y >= 330 && y <= 460) dilated[idx] = 0;
    }
  }

  // Harmonic relaxation from the surrounding background colors
  const rGrid = new Float32Array(width * height);
  const gGrid = new Float32Array(width * height);
  const bGrid = new Float32Array(width * height);

  for (let i = 0; i < width * height; i++) {
    rGrid[i] = data[i * channels];
    gGrid[i] = data[i * channels + 1];
    bGrid[i] = data[i * channels + 2];
  }

  for (let iter = 0; iter < 500; iter++) {
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

  // Create smooth depth of field (creamy bokeh) on background
  const fgMask = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (y >= 410) { fgMask[idx] = 1.0; continue; }
      if (x >= 395 && x <= 560 && y >= 50 && y <= 410) { fgMask[idx] = 1.0; continue; }
      if (x >= 60 && x <= 395 && y >= 260 && y <= 410) { fgMask[idx] = 1.0; continue; }
      if (x >= 690 && x <= 980 && y >= 305 && y <= 410) { fgMask[idx] = 1.0; continue; }
      if (y < 40) { fgMask[idx] = 0.3; continue; }
      fgMask[idx] = 0.0;
    }
  }

  const smoothFg = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0, count = 0;
      for (let dy = -12; dy <= 12; dy += 2) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -12; dx <= 12; dx += 2) {
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
    .blur(18)
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

  // Crop & format to 1024 x 1536 (2:3 aspect ratio)
  const finalWebp = await sharp(finalComposite, { raw: { width, height, channels } })
    .extract({ left: 85, top: 0, width: 980, height: 1460 })
    .resize(1024, 1536, { fit: 'cover' })
    .modulate({
      brightness: 1.0,
      saturation: 1.06,
    })
    .webp({ quality: 95 })
    .toBuffer();

  fs.writeFileSync('public/cover-my-son-does-not-work-here.webp', finalWebp);
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/cover-my-son-does-not-work-here.webp', finalWebp);
  }
  console.log('Successfully generated flawless cinematic cover photo!');
}

buildFlawlessCinematicCover().catch(console.error);
