const fs = require('fs');
const sharp = require('sharp');

// Create realistic metallic Ugandan Shilling coins
const svg = `
<svg width="450" height="350" viewBox="0 0 450 350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Brass / Gold Rim Gradient -->
    <radialGradient id="brassOuter" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff2a8"/>
      <stop offset="35%" stop-color="#d4af37"/>
      <stop offset="70%" stop-color="#996e14"/>
      <stop offset="100%" stop-color="#5a3d04"/>
    </radialGradient>

    <!-- Silver / Nickel Center Gradient -->
    <radialGradient id="silverCenter" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#e2e8f0"/>
      <stop offset="65%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#475569"/>
    </radialGradient>

    <!-- Bronze 100 Coin Gradient -->
    <radialGradient id="bronzeCoin" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f5d0a9"/>
      <stop offset="35%" stop-color="#c67d38"/>
      <stop offset="70%" stop-color="#8b4d1b"/>
      <stop offset="100%" stop-color="#4e2507"/>
    </radialGradient>

    <!-- Deep Ambient Occlusion Drop Shadow onto Table -->
    <filter id="tableShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="8" dy="12" stdDeviation="8" flood-color="#0a0502" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Group of coins clustered naturally on bedside table -->
  
  <!-- COIN 1: 1000 UGX (Bi-metallic, angled) -->
  <g transform="translate(150, 140) rotate(-12)" filter="url(#tableShadow)">
    <!-- Outer Brass Ring -->
    <circle cx="0" cy="0" r="82" fill="url(#brassOuter)"/>
    <!-- Reeded edge rim -->
    <circle cx="0" cy="0" r="79" fill="none" stroke="#7a5508" stroke-width="2"/>
    <circle cx="0" cy="0" r="77" fill="none" stroke="#fff8cc" stroke-width="1"/>
    
    <!-- Inner Silver Core -->
    <circle cx="0" cy="0" r="54" fill="url(#silverCenter)"/>
    <circle cx="0" cy="0" r="52" fill="none" stroke="#64748b" stroke-width="1.5"/>
    
    <!-- Relief Engraving -->
    <!-- Crested Crane / Value -->
    <text x="0" y="-12" font-family="'Liberation Serif', serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle" letter-spacing="2">BANK OF UGANDA</text>
    <text x="0" y="16" font-family="'Liberation Sans', sans-serif" font-size="28" font-weight="900" fill="#1e293b" text-anchor="middle">1000</text>
    <text x="0" y="34" font-family="'Liberation Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle" letter-spacing="1">SHILLINGS</text>
  </g>

  <!-- COIN 2: Second 1000 UGX (overlapping slightly) -->
  <g transform="translate(260, 175) rotate(18)" filter="url(#tableShadow)">
    <!-- Outer Brass Ring -->
    <circle cx="0" cy="0" r="82" fill="url(#brassOuter)"/>
    <circle cx="0" cy="0" r="79" fill="none" stroke="#7a5508" stroke-width="2"/>
    <circle cx="0" cy="0" r="77" fill="none" stroke="#fff8cc" stroke-width="1"/>
    
    <!-- Inner Silver Core -->
    <circle cx="0" cy="0" r="54" fill="url(#silverCenter)"/>
    <circle cx="0" cy="0" r="52" fill="none" stroke="#64748b" stroke-width="1.5"/>
    
    <!-- Crested Crane Silhouette -->
    <path d="M 0,-30 C -8,-25 -10,-10 -6,0 C 0,10 6,18 4,28 L -4,28 M 2,-18 C 12,-18 16,-8 14,0" fill="none" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
    <text x="0" y="18" font-family="'Liberation Sans', sans-serif" font-size="28" font-weight="900" fill="#1e293b" text-anchor="middle">1000</text>
  </g>

  <!-- COIN 3: 200 UGX (Silver, smaller) -->
  <g transform="translate(100, 220) rotate(-25)" filter="url(#tableShadow)">
    <circle cx="0" cy="0" r="62" fill="url(#silverCenter)"/>
    <circle cx="0" cy="0" r="59" fill="none" stroke="#475569" stroke-width="1.8"/>
    <circle cx="0" cy="0" r="57" fill="none" stroke="#ffffff" stroke-width="1"/>
    
    <text x="0" y="-8" font-family="'Liberation Serif', serif" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle" letter-spacing="1">BANK OF UGANDA</text>
    <text x="0" y="16" font-family="'Liberation Sans', sans-serif" font-size="24" font-weight="900" fill="#1e293b" text-anchor="middle">200</text>
    <text x="0" y="32" font-family="'Liberation Sans', sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">SHILLINGS</text>
  </g>

  <!-- COIN 4: 100 UGX (Bronze, resting nearby) -->
  <g transform="translate(350, 230) rotate(35)" filter="url(#tableShadow)">
    <circle cx="0" cy="0" r="54" fill="url(#bronzeCoin)"/>
    <circle cx="0" cy="0" r="51" fill="none" stroke="#4e2507" stroke-width="1.8"/>
    <circle cx="0" cy="0" r="49" fill="none" stroke="#f5d0a9" stroke-width="1"/>
    
    <text x="0" y="-6" font-family="'Liberation Serif', serif" font-size="9" font-weight="bold" fill="#361703" text-anchor="middle" letter-spacing="1">UGANDA</text>
    <text x="0" y="16" font-family="'Liberation Sans', sans-serif" font-size="22" font-weight="900" fill="#2d1302" text-anchor="middle">100</text>
  </g>
</svg>
`;

fs.writeFileSync('public/temp_coins.svg', svg);

sharp(Buffer.from(svg))
  .png()
  .toFile('public/temp_coins.png')
  .then(() => console.log('Coins rendered!'));
