import sharp from 'sharp';
import fs from 'fs';

async function optimizeImages() {
  console.log('Optimizing card images (493w and 740w at quality 76)...');
  for (let i = 1; i <= 4; i++) {
    const pngPath = `src/assets/card-${i}.png`;
    
    // 493w variant (493x400)
    await sharp(pngPath)
      .resize(493, 400)
      .webp({ quality: 76, effort: 6 })
      .toFile(`src/assets/card-${i}-493.webp`);
    console.log(`✅ Generated src/assets/card-${i}-493.webp`);

    // 740w variant (740x600)
    await sharp(pngPath)
      .resize(740, 600)
      .webp({ quality: 76, effort: 6 })
      .toFile(`src/assets/card-${i}-740.webp`);
    console.log(`✅ Generated src/assets/card-${i}-740.webp`);

    // Remove obsolete 986w variants if they exist
    const p986 = `src/assets/card-${i}-986.webp`;
    if (fs.existsSync(p986)) {
      fs.unlinkSync(p986);
      console.log(`🗑️ Removed ${p986}`);
    }
  }

  console.log('\nOptimizing figure.webp (378x473 display size, plus 2x 756w variant)...');
  const figureSrc = 'src/assets/figure.png';

  // 378w variant (378x473)
  await sharp(figureSrc)
    .resize(378, 473)
    .webp({ quality: 78, effort: 6 })
    .toFile('public/figure-378.webp');
  console.log('✅ Generated public/figure-378.webp');

  // Also write public/figure.webp as the canonical 378x473 image for default fallback
  await sharp(figureSrc)
    .resize(378, 473)
    .webp({ quality: 78, effort: 6 })
    .toFile('public/figure.webp');
  console.log('✅ Updated public/figure.webp (378x473)');

  // 756w variant (756x946 for retina 2x)
  await sharp(figureSrc)
    .resize(756, 946)
    .webp({ quality: 78, effort: 6 })
    .toFile('public/figure-756.webp');
  console.log('✅ Generated public/figure-756.webp');

  console.log('\nImage optimization complete!');
}

optimizeImages().catch(console.error);
