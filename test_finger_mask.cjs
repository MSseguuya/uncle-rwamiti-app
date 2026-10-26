const sharp = require('sharp');

async function createFingerMask() {
  // In cover-last-transfer.webp, let's examine the hand area:
  // x: 0 to 560, y: 700 to 1000
  // The hand is much darker than the illuminated screen in that region, or we can use the original photo
  // where the phone screen edge is behind the hand.
  // Let's create an extraction of the hand.
  const { data, info } = await sharp('public/cover-last-transfer.webp')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // Let's create an alpha mask for the hand/finger
  // The finger tip is at roughly x: 470-520, y: 840-880.
  // The entire hand extends to x: 0.
  // Anywhere outside the phone screen polygon, we don't even need to replace!
  // The replacement ONLY needs to happen inside the phone screen quadrilateral.
  console.log('Image dimensions:', width, height);
}
createFingerMask();
