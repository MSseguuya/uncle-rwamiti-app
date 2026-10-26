const sharp = require('sharp');

async function compositeFrame() {
  // Let's create an inpaint patch for the top-right ribbon
  // The ribbon on top frame: x: 840 to 930, y: 105 to 165
  // We can patch it with wood from x: 720 to 810, y: 115 to 175
  const woodPatch = await sharp('public/cover-last-transfer.webp')
    .extract({ left: 720, top: 120, width: 90, height: 50 })
    .toBuffer();

  // Also patch the background behind the top of frame
  const bgPatch = await sharp('public/cover-last-transfer.webp')
    .extract({ left: 950, top: 400, width: 70, height: 150 })
    .toBuffer();

  // Also flower cutout: x: 700 to 960, y: 570 to 700
  // In cover-last-transfer.webp, where the flower is, the lily petals are bright/yellowish
  // Let's create a combined composite
  console.log('Patches extracted');
}
compositeFrame();
