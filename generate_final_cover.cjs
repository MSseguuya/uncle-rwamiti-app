const fs = require('fs');
const sharp = require('sharp');
const { execSync } = require('child_process');

async function buildCover() {
  console.log('1. Rendering Diploma Certificate SVG...');
  
  const certSvg = `
  <svg width="1200" height="1700" viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="paperGrad" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#fdfbf5"/>
        <stop offset="60%" stop-color="#f6efe0"/>
        <stop offset="100%" stop-color="#e3d4ba"/>
      </radialGradient>

      <!-- Warm bedside lamp light wash from upper right -->
      <linearGradient id="lampWash" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffeed0" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#ffd599" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#2a1e12" stop-opacity="0.25"/>
      </linearGradient>

      <!-- Glass specular reflection -->
      <linearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0.04"/>
        <stop offset="70%" stop-color="#000000" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
      </linearGradient>

      <radialGradient id="goldSeal" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffe899"/>
        <stop offset="40%" stop-color="#d4af37"/>
        <stop offset="70%" stop-color="#aa7c11"/>
        <stop offset="100%" stop-color="#6b4c05"/>
      </radialGradient>

      <radialGradient id="redWax" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stop-color="#c92828"/>
        <stop offset="60%" stop-color="#801010"/>
        <stop offset="100%" stop-color="#420606"/>
      </radialGradient>

      <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#3a2512" flood-opacity="0.45"/>
      </filter>
    </defs>

    <!-- Parchment Paper -->
    <rect width="1200" height="1700" fill="url(#paperGrad)"/>

    <!-- Double Border -->
    <rect x="55" y="55" width="1090" height="1590" fill="none" stroke="#251e16" stroke-width="4"/>
    <rect x="70" y="70" width="1060" height="1560" fill="none" stroke="#7a5d34" stroke-width="1.5" stroke-dasharray="8,4"/>
    <rect x="80" y="80" width="1040" height="1540" fill="none" stroke="#251e16" stroke-width="1"/>

    <!-- Ornate Corners -->
    <g fill="#251e16">
      <circle cx="55" cy="55" r="9"/>
      <path d="M 55,55 L 105,55 L 105,58 L 58,58 L 58,105 L 55,105 Z"/>
      <circle cx="1145" cy="55" r="9"/>
      <path d="M 1145,55 L 1095,55 L 1095,58 L 1142,58 L 1142,105 L 1145,105 Z"/>
      <circle cx="55" cy="1645" r="9"/>
      <path d="M 55,1645 L 105,1645 L 105,1642 L 58,1642 L 58,1595 L 55,1595 Z"/>
      <circle cx="1145" cy="1645" r="9"/>
      <path d="M 1145,1645 L 1095,1645 L 1095,1642 L 1142,1642 L 1142,1595 L 1145,1595 Z"/>
    </g>

    <!-- Crest Shield -->
    <g transform="translate(600, 215)">
      <path d="M -65,-55 L 65,-55 L 65,10 C 65,55 0,90 0,90 C 0,90 -65,55 -65,10 Z" fill="#1b2e4b" stroke="#aa7c11" stroke-width="4"/>
      <path d="M -30,-18 L 30,-18 L 22,22 C 18,40 0,55 0,55 C 0,55 -18,40 -22,22 Z" fill="#aa7c11"/>
      <!-- Open Book -->
      <path d="M -20,-2 C -10,-6 0,-3 0,-3 C 0,-3 10,-6 20,-2 L 18,14 C 10,10 0,12 0,12 C 0,12 -10,10 -18,14 Z" fill="#fdfbf5"/>
      <!-- Ribbon -->
      <path d="M -115,108 L 115,108 L 95,126 L 115,144 L -115,144 L -95,126 Z" fill="#aa7c11"/>
      <text x="0" y="132" font-family="'Liberation Serif', serif" font-size="15" font-weight="bold" fill="#fdfbf5" text-anchor="middle" letter-spacing="2.5">WE BUILD FOR THE FUTURE</text>
    </g>

    <!-- Institution Header -->
    <text x="600" y="425" font-family="'Liberation Serif', serif" font-size="46" font-weight="bold" fill="#18202b" text-anchor="middle" letter-spacing="5">MAKERERE UNIVERSITY</text>
    <text x="600" y="465" font-family="'Liberation Serif', serif" font-size="20" font-style="italic" fill="#504535" text-anchor="middle" letter-spacing="2">KAMPALA, UGANDA</text>

    <!-- Divider -->
    <path d="M 380,500 L 820,500" stroke="#aa7c11" stroke-width="2"/>
    <circle cx="600" cy="500" r="5" fill="#aa7c11"/>

    <!-- Preamble -->
    <text x="600" y="570" font-family="'Liberation Serif', serif" font-size="26" font-style="italic" fill="#332c22" text-anchor="middle">This is to certify that</text>

    <!-- Graduate Name -->
    <g transform="translate(600, 680)">
      <line x1="-360" y1="20" x2="360" y2="20" stroke="#7a5d34" stroke-width="1.5"/>
      <text x="0" y="0" font-family="'Liberation Serif', serif" font-size="54" font-weight="bold" fill="#111822" text-anchor="middle" letter-spacing="4">ALEX SSEGUYA</text>
    </g>

    <!-- Statement -->
    <text x="600" y="780" font-family="'Liberation Serif', serif" font-size="24" fill="#443b2f" text-anchor="middle">has satisfied all requirements and was admitted to the Degree of</text>

    <!-- DEGREE TITLE -->
    <g transform="translate(600, 890)">
      <text x="0" y="0" font-family="'Liberation Serif', serif" font-size="60" font-weight="bold" fill="#111b27" text-anchor="middle" letter-spacing="4">BACHELOR OF ARTS</text>
      <text x="0" y="52" font-family="'Liberation Serif', serif" font-size="28" font-weight="bold" fill="#7a2a18" text-anchor="middle" letter-spacing="2">SECOND CLASS HONOURS (UPPER DIVISION)</text>
      <text x="0" y="100" font-family="'Liberation Serif', serif" font-size="25" font-style="italic" fill="#332c22" text-anchor="middle">in Economics &amp; Social Statistics</text>
    </g>

    <!-- Senate Statement -->
    <text x="600" y="1120" font-family="'Liberation Serif', serif" font-size="21" fill="#554b3e" text-anchor="middle">Conferred by the Authority of the University Senate</text>
    <text x="600" y="1155" font-family="'Liberation Serif', serif" font-size="18" font-style="italic" fill="#665b4c" text-anchor="middle">Given under our hands and the Common Seal of the University</text>

    <!-- Wax Seal & Medallion -->
    <g transform="translate(600, 1330)" filter="url(#sealShadow)">
      <path d="M -28,35 L -45,140 L -18,125 L 0,140 L -8,35 Z" fill="#7a1010" opacity="0.9"/>
      <path d="M 8,35 L 0,140 L 18,125 L 45,140 L 28,35 Z" fill="#600909" opacity="0.9"/>
      <circle cx="0" cy="0" r="90" fill="url(#redWax)"/>
      <circle cx="0" cy="0" r="70" fill="none" stroke="url(#goldSeal)" stroke-width="4.5" stroke-dasharray="9,3"/>
      <circle cx="0" cy="0" r="58" fill="url(#goldSeal)"/>
      <circle cx="0" cy="0" r="50" fill="#7a1010"/>
      <text x="0" y="-10" font-family="'Liberation Serif', serif" font-size="14" font-weight="bold" fill="#ffd599" text-anchor="middle" letter-spacing="2">OFFICIAL</text>
      <text x="0" y="10" font-family="'Liberation Serif', serif" font-size="14" font-weight="bold" fill="#ffd599" text-anchor="middle" letter-spacing="2">SEAL</text>
      <text x="0" y="26" font-family="'Liberation Serif', serif" font-size="10" fill="#ffe899" text-anchor="middle" letter-spacing="1">UGANDA</text>
    </g>

    <!-- Signatures -->
    <g transform="translate(260, 1420)">
      <path d="M -110,-20 C -70,-50 -50,10 -10,-30 C 15,-55 40,-10 70,-25 C 95,-35 110,-10 120,-15" fill="none" stroke="#141a29" stroke-width="3" stroke-linecap="round"/>
      <line x1="-130" y1="0" x2="130" y2="0" stroke="#443c2f" stroke-width="1.5"/>
      <text x="0" y="28" font-family="'Liberation Serif', serif" font-size="20" font-weight="bold" fill="#2b2318" text-anchor="middle">VICE-CHANCELLOR</text>
    </g>

    <g transform="translate(940, 1420)">
      <path d="M -120,-10 C -90,-40 -70,-5 -30,-45 C 10,-60 20,-15 60,-30 C 80,-40 100,-15 115,-20" fill="none" stroke="#141a29" stroke-width="3" stroke-linecap="round"/>
      <line x1="-130" y1="0" x2="130" y2="0" stroke="#443c2f" stroke-width="1.5"/>
      <text x="0" y="28" font-family="'Liberation Serif', serif" font-size="20" font-weight="bold" fill="#2b2318" text-anchor="middle">ACADEMIC REGISTRAR</text>
    </g>

    <text x="1110" y="1610" font-family="'Liberation Serif', serif" font-size="15" fill="#887965" text-anchor="end" letter-spacing="2">NO. MAK/BA/2022/04891</text>

    <!-- Natural Room Light + Glass Glare Overlays -->
    <rect width="1200" height="1700" fill="url(#lampWash)" style="mix-blend-mode: multiply; pointer-events: none;"/>
    <rect width="1200" height="1700" fill="url(#glassGlare)" style="mix-blend-mode: screen; pointer-events: none;"/>
  </svg>
  `;

  await sharp(Buffer.from(certSvg)).png().toFile('public/temp_cert_final.png');

  console.log('2. Warping Certificate into Picture Frame...');
  // Precise glass bevel opening:
  // Top-Left: 665, 180
  // Top-Right: 975, 170
  // Bottom-Right: 935, 625
  // Bottom-Left: 650, 635
  execSync(`convert public/temp_cert_final.png -virtual-pixel transparent -set option:distort:viewport 1024x1536+0+0 -distort Perspective "0,0,665,180  1200,0,975,170  1200,1700,935,625  0,1700,650,635" public/temp_warped_cert_final.png`);

  console.log('3. Rendering Smartphone Screen UI (OLED Dark Mode)...');
  const phoneSvg = `
  <svg width="600" height="1150" viewBox="0 0 600 1150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0b141a"/>
        <stop offset="100%" stop-color="#070c0f"/>
      </linearGradient>

      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1f2c34"/>
        <stop offset="100%" stop-color="#182229"/>
      </linearGradient>

      <linearGradient id="notifGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1b2730"/>
        <stop offset="100%" stop-color="#121b22"/>
      </linearGradient>

      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
      </filter>

      <!-- Glass sheen -->
      <linearGradient id="screenSheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="40%" stop-color="#ffffff" stop-opacity="0.02"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
      </linearGradient>
    </defs>

    <!-- OLED Background with rounded screen corners (rx=28) -->
    <rect width="600" height="1150" rx="28" fill="url(#bgGrad)"/>

    <!-- ================= TOP STATUS BAR ================= -->
    <g transform="translate(0, 0)">
      <rect width="600" height="48" rx="28" fill="#131c21"/>
      <rect x="0" y="24" width="600" height="24" fill="#131c21"/>
      <!-- Time -->
      <text x="40" y="32" font-family="'Liberation Sans', sans-serif" font-size="20" font-weight="bold" fill="#ffffff">19:46</text>
      
      <!-- Status Icons Right -->
      <g transform="translate(435, 18)">
        <text x="0" y="14" font-family="'Liberation Sans', sans-serif" font-size="14" font-weight="bold" fill="#8696a0">4G</text>
        <g transform="translate(26, 2)">
          <rect x="0" y="9" width="3.5" height="4" rx="1" fill="#e9edef"/>
          <rect x="5.5" y="6" width="3.5" height="7" rx="1" fill="#e9edef"/>
          <rect x="11" y="3" width="3.5" height="10" rx="1" fill="#e9edef"/>
          <rect x="16.5" y="0" width="3.5" height="13" rx="1" fill="#536471"/>
        </g>
        <g transform="translate(56, 1)">
          <rect x="0" y="0" width="32" height="16" rx="3.5" fill="none" stroke="#e9edef" stroke-width="1.8"/>
          <rect x="33" y="4.5" width="2" height="7" rx="1" fill="#e9edef"/>
          <rect x="2.5" y="2.5" width="6" height="11" rx="1.5" fill="#ef4444"/>
        </g>
        <text x="96" y="13" font-family="'Liberation Sans', sans-serif" font-size="13" font-weight="bold" fill="#ef4444">14%</text>
      </g>
    </g>

    <!-- ================= WHATSAPP APP BAR ================= -->
    <g transform="translate(0, 48)">
      <rect width="600" height="76" fill="url(#headerGrad)"/>
      <line x1="0" y1="76" x2="600" y2="76" stroke="#222e35" stroke-width="1"/>

      <!-- Back arrow -->
      <path d="M 28,38 L 40,26 M 28,38 L 40,50" stroke="#aebac1" stroke-width="3" stroke-linecap="round"/>

      <!-- Mum Avatar Circle -->
      <circle cx="76" cy="38" r="23" fill="#e05353"/>
      <text x="76" y="46" font-family="'Liberation Sans', sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">M</text>

      <!-- Contact Name & Online Status -->
      <text x="116" y="32" font-family="'Liberation Sans', sans-serif" font-size="22" font-weight="bold" fill="#e9edef">Mum</text>
      <circle cx="122" cy="48" r="4.5" fill="#25d366"/>
      <text x="134" y="52" font-family="'Liberation Sans', sans-serif" font-size="15" font-weight="500" fill="#25d366">online</text>

      <!-- 3 dots menu right -->
      <g transform="translate(550, 26)" fill="#aebac1">
        <circle cx="0" cy="12" r="3"/>
        <circle cx="12" cy="12" r="3"/>
        <circle cx="24" cy="12" r="3"/>
      </g>
    </g>

    <!-- ================= BRIGHTPATH SHORTLIST POPUP CARD ================= -->
    <g transform="translate(24, 145)" filter="url(#cardShadow)">
      <rect width="552" height="152" rx="16" fill="url(#notifGrad)" stroke="#00a884" stroke-width="1.8"/>
      
      <!-- App Icon Badge -->
      <rect x="20" y="18" width="40" height="40" rx="10" fill="#00a884"/>
      <path d="M 28,38 L 35,27 L 45,27 L 52,38 Z M 33,27 L 33,23 C 33,21 35,19 38,19 C 41,19 43,21 43,23 L 43,27" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linejoin="round"/>

      <text x="72" y="34" font-family="'Liberation Sans', sans-serif" font-size="16" font-weight="bold" fill="#00a884" letter-spacing="1">BRIGHTPATH CONSULTING</text>
      <text x="72" y="52" font-family="'Liberation Sans', sans-serif" font-size="13" fill="#8696a0">Shortlist Notification • 7:46 PM</text>

      <text x="20" y="86" font-family="'Liberation Sans', sans-serif" font-size="18" font-weight="bold" fill="#ffffff">“Your application has been shortlisted.”</text>
      <text x="20" y="114" font-family="'Liberation Sans', sans-serif" font-size="15" fill="#aebac1">Interview tomorrow, 9:00 a.m., Ntinda Plot 4B.</text>
      <text x="20" y="136" font-family="'Liberation Sans', sans-serif" font-size="14" font-weight="bold" fill="#e2a03f">Please bring your original academic certificates.</text>
    </g>

    <!-- ================= MTN MOBILE MONEY BALANCE PILL ================= -->
    <g transform="translate(100, 325)">
      <rect width="400" height="52" rx="26" fill="#182229" stroke="#ffcc00" stroke-width="2"/>
      <circle cx="30" cy="26" r="17" fill="#ffcc00"/>
      <text x="30" y="33" font-family="'Liberation Sans', sans-serif" font-size="17" font-weight="900" fill="#000000" text-anchor="middle">M</text>
      
      <text x="60" y="27" font-family="'Liberation Sans', sans-serif" font-size="15" font-weight="bold" fill="#ffcc00">MTN MoMo: </text>
      <text x="160" y="27" font-family="'Liberation Sans', sans-serif" font-size="17" font-weight="bold" fill="#ffffff">UGX 2,300</text>
      <text x="60" y="44" font-family="'Liberation Sans', sans-serif" font-size="13" fill="#8696a0">Return transport needed: UGX 20,000</text>
    </g>

    <!-- ================= CHAT MESSAGES ================= -->
    <g transform="translate(255, 405)">
      <rect width="90" height="26" rx="8" fill="#182229"/>
      <text x="45" y="18" font-family="'Liberation Sans', sans-serif" font-size="13" font-weight="600" fill="#8696a0" text-anchor="middle">TODAY</text>
    </g>

    <!-- Mum's Incoming Chat Bubble -->
    <g transform="translate(24, 455)" filter="url(#cardShadow)">
      <path d="M 0,16 C 0,7 7,0 16,0 L 370,0 C 379,0 386,7 386,16 L 386,96 C 386,105 379,112 370,112 L 16,112 C 7,112 0,105 0,96 Z" fill="#202c33"/>
      <path d="M -8,14 L 0,8 L 0,22 Z" fill="#202c33"/>

      <text x="20" y="28" font-family="'Liberation Sans', sans-serif" font-size="15" font-weight="bold" fill="#53bdeb">Mum</text>
      <text x="20" y="62" font-family="'Liberation Sans', sans-serif" font-size="20" fill="#e9edef">Alex, have you eaten anything?</text>
      <text x="20" y="92" font-family="'Liberation Sans', sans-serif" font-size="16" fill="#8696a0">How was your day?</text>
      <text x="365" y="98" font-family="'Liberation Sans', sans-serif" font-size="13" fill="#8696a0" text-anchor="end">6:14 PM</text>
    </g>

    <!-- Family Group Banner from Episode -->
    <g transform="translate(60, 600)" filter="url(#cardShadow)">
      <rect width="480" height="74" rx="12" fill="#182229" stroke="#2a3942" stroke-width="1.2"/>
      <text x="18" y="26" font-family="'Liberation Sans', sans-serif" font-size="14" font-weight="bold" fill="#25d366">Family Group • 7:15 PM</text>
      <text x="18" y="48" font-family="'Liberation Sans', sans-serif" font-size="15" fill="#e9edef">Dad: “Congratulations to Daniel. First salary!”</text>
      <text x="18" y="66" font-family="'Liberation Sans', sans-serif" font-size="13" fill="#8696a0">Mum: “God is so good! We are proud of you.”</text>
    </g>

    <!-- ================= BOTTOM CHAT INPUT BAR ================= -->
    <g transform="translate(0, 960)">
      <rect width="600" height="140" fill="#111b21"/>

      <g transform="translate(24, 34)" fill="#8696a0">
        <circle cx="16" cy="16" r="14" fill="none" stroke="#8696a0" stroke-width="2"/>
        <circle cx="10" cy="12" r="2"/>
        <circle cx="22" cy="12" r="2"/>
        <path d="M 10,21 C 13,25 19,25 22,21" fill="none" stroke="#8696a0" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Input Field -->
      <rect x="72" y="16" width="418" height="68" rx="34" fill="#2a3942"/>
      <text x="96" y="58" font-family="'Liberation Sans', sans-serif" font-size="20" font-weight="500" fill="#ffffff">Mum, send me something small</text>
      <line x1="416" y1="32" x2="416" y2="68" stroke="#00a884" stroke-width="3"/>

      <!-- Send Button -->
      <g transform="translate(506, 16)">
        <circle cx="34" cy="34" r="34" fill="#00a884"/>
        <path d="M 23,34 L 43,23 L 36,45 L 31,36 Z" fill="#ffffff"/>
        <path d="M 43,23 L 31,36" stroke="#00a884" stroke-width="1.5"/>
      </g>
    </g>

    <g transform="translate(210, 1125)">
      <rect width="180" height="5" rx="2.5" fill="#ffffff" opacity="0.4"/>
    </g>

    <rect width="600" height="1150" rx="28" fill="url(#screenSheen)" style="mix-blend-mode: screen; pointer-events: none;"/>
  </svg>
  `;

  await sharp(Buffer.from(phoneSvg)).png().toFile('public/temp_phone_final.png');

  console.log('4. Warping Phone Screen into Bedside Scene...');
  // Calibrated phone screen corners:
  // Top-Left: 596, 832
  // Top-Right: 772, 860
  // Bottom-Right: 638, 1120
  // Bottom-Left: 338, 1042
  execSync(`convert public/temp_phone_final.png -virtual-pixel transparent -set option:distort:viewport 1024x1536+0+0 -distort Perspective "0,0,596,832  600,0,772,860  600,1150,638,1120  0,1150,338,1042" public/temp_warped_phone_final.png`);

  console.log('5. Warping Coins onto Bedside Table in 3D Perspective...');
  // Tilt coins flat onto the mahogany nightstand near the lamp and phone
  // Source: 450 x 350
  // Target: resting at x: 670 to 880, y: 550 to 670
  execSync(`convert public/temp_coins.png -virtual-pixel transparent -set option:distort:viewport 1024x1536+0+0 -distort Perspective "0,0,670,580  450,0,870,570  450,350,850,660  0,350,660,670" public/temp_warped_coins_final.png`);

  console.log('6. Assembling Master Multi-Layer Composite...');
  
  // Base: cover-last-transfer.webp
  // Layer 1: Warped Diploma Certificate (inside picture frame)
  // Layer 2: Clean wood inpainting patch for top-right frame (removes black mourning ribbon!)
  // Layer 3: Natural dried flower overlay (keeps white petals in front of frame glass)
  // Layer 4: Warped phone screen
  // Layer 5: Hand and index finger overlay
  // Layer 6: Warped metallic coins on table

  // Step 6a: Extract wood patch to heal ribbon on top-right frame
  // From left side of top frame: x: 730 to 820, y: 125 to 175
  const topWoodPatch = await sharp('public/cover-last-transfer.webp')
    .extract({ left: 730, top: 125, width: 90, height: 50 })
    .toBuffer();

  // Patch for right frame moulding: x: 710 to 740, y: 300 to 450
  const sideWoodPatch = await sharp('public/cover-last-transfer.webp')
    .extract({ left: 700, top: 220, width: 35, height: 180 })
    .toBuffer();

  // Flower petals cutout in front of the frame glass
  // Extract flower region: left: 650, top: 580, width: 250, height: 140
  const flowerCrop = await sharp('public/cover-last-transfer.webp')
    .extract({ left: 650, top: 580, width: 250, height: 140 })
    .toBuffer();

  // Let's create an alpha mask for the flower petals (bright white/yellowish lily petals)
  const { data: fData } = await sharp(flowerCrop).raw().toBuffer({ resolveWithObject: true });
  const fMask = Buffer.alloc(250 * 140);
  for (let i = 0; i < 250 * 140; i++) {
    const r = fData[i*3];
    const g = fData[i*3+1];
    const b = fData[i*3+2];
    // Petals are bright cream/yellow: r > 100, g > 80, b > 50
    if (r > 95 && g > 75 && b > 40) {
      fMask[i] = Math.min(255, Math.round(((r + g + b) / 3 - 60) * 2.5));
    }
  }
  const flowerAlpha = await sharp(flowerCrop)
    .joinChannel(fMask, { raw: { width: 250, height: 140, channels: 1 } })
    .png()
    .toBuffer();

  // Hand and fingertip overlay
  // Extract hand region: left: 0, top: 650, width: 560, height: 350
  const handCrop = await sharp('public/cover-last-transfer.webp')
    .extract({ left: 0, top: 650, width: 560, height: 350 })
    .toBuffer();
  
  const { data: hData } = await sharp(handCrop).raw().toBuffer({ resolveWithObject: true });
  const hMask = Buffer.alloc(560 * 350);
  for (let y = 0; y < 350; y++) {
    for (let x = 0; x < 560; x++) {
      const idx = y * 560 + x;
      // The hand is on the left; anywhere x < 400 is 100% hand/table
      // For x between 400 and 560, y between 100 and 260 (fingertip touching screen):
      const r = hData[idx*3];
      const g = hData[idx*3+1];
      const b = hData[idx*3+2];
      if (x < 420) {
        hMask[idx] = 255;
      } else if (x < 530 && y < 260) {
        // Finger skin tone: darker than the glowing screen
        if (r < 110 && g < 75 && b < 60) {
          hMask[idx] = 255;
        } else if (r < 130 && g < 90 && b < 70) {
          hMask[idx] = 160;
        }
      }
    }
  }

  const handAlpha = await sharp(handCrop)
    .joinChannel(hMask, { raw: { width: 560, height: 350, channels: 1 } })
    .png()
    .toBuffer();

  // Composite everything cleanly onto base image
  console.log('Compounding final image layers...');
  await sharp('public/cover-last-transfer.webp')
    .composite([
      // 1. Warped Degree Certificate in picture frame
      { input: 'public/temp_warped_cert_final.png', top: 0, left: 0 },
      // 2. Heal top-right wooden frame ribbon
      { input: topWoodPatch, top: 110, left: 865, blend: 'over' },
      // 3. Flower petals in front of frame glass
      { input: flowerAlpha, top: 580, left: 650, blend: 'over' },
      // 4. Warped OLED phone screen
      { input: 'public/temp_warped_phone_final.png', top: 0, left: 0 },
      // 5. Photographic hand and index finger touching phone
      { input: handAlpha, top: 650, left: 0, blend: 'over' },
      // 6. Ugandan Shilling coins on wooden nightstand
      { input: 'public/temp_warped_coins_final.png', top: 0, left: 0 }
    ])
    .webp({ quality: 92 })
    .toFile('public/cover-send-me-something-small.webp');

  // Also copy to dist/
  fs.copyFileSync('public/cover-send-me-something-small.webp', 'dist/cover-send-me-something-small.webp');

  console.log('Master Cover Successfully Created at public/cover-send-me-something-small.webp and dist/!');
}

buildCover().catch(err => {
  console.error('Error generating cover:', err);
  process.exit(1);
});
