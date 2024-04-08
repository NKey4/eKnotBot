const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const sizes = require("../configs/sizes.json");

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

    fs.writeFileSync(
      path.join(resultDir, newImageName),
      await image.getBufferAsync(jimp.AUTO)
    );

    console.log(newImageName);
  }

  console.log("----------------------------");
}

(async () => {
  for (let imageName of images) {
    await processImage(imageName);
  }
})();
