import path from 'path';
import fs from 'fs';
import jimp from 'jimp';
import sizes from '../configs/sizes.json';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultDir = path.resolve(__dirname, "./images/default");
const resultDir = path.resolve(__dirname, "./images/result");
const images = fs
  .readdirSync(defaultDir)
  .filter((name) => /\.(gif|jpe?g|tiff?|png|bmp)$/i.test(name));

async function processImage(imageName) {
  const buffer = fs.readFileSync(path.join(defaultDir, imageName));
  const parsedName = path.parse(imageName);

  for (let ratio in sizes) {
    const size = sizes[ratio];
    const newImageName = `${parsedName.name}-${ratio}${parsedName.ext}`;
    let image = await jimp.read(buffer);

    image.contain(size.width, size.height).background(0xffffffff).normalize();

    await image.writeAsync(path.join(resultDir, newImageName));

    console.log(newImageName);
  }

  console.log("----------------------------");
}

(async () => {
  for (let imageName of images) {
    await processImage(imageName);
  }
})();
