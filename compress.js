import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function compressImage(srcPath, destPath) {
  try {
    await sharp(srcPath)
      .webp({ quality: 80 })
      .toFile(destPath);
    console.log(`Compressed: ${destPath}`);
  } catch (err) {
    console.error(`Error compressing ${srcPath}:`, err);
  }
}

async function run() {
  await compressImage('public/Architectural_stairs_with_texture_2K_202607151740_3.jpg', 'src/assets/bg1.webp');
  await compressImage('public/Cinematic_tilted_camera_angle_2K_202607160221-Recuperado.png', 'src/assets/bg2.webp');
  await compressImage('public/manos_lazos.png', 'src/assets/bg3.webp');
}
run();
