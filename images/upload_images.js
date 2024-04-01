import path from "path";
import fs from "fs";
import request from "request-promise";
import dotenv from "dotenv";
dotenv.config();
(async () => {
  const result_dir = path.resolve(__dirname, "./images/result"),
    images = fs
      .readdirSync(result_dir)
      .filter((name) => name.search(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i) !== -1);
  for (let image_name of images) {
    const buffer = fs.readFileSync(`${result_dir}/${image_name}`);

    let result = await request.post({
      url: `https://dialogs.yandex.net/api/v1/skills/${process.env.YANDEX_SKILL_ID}/images`,
      headers: {
        Authorization: `OAuth ${process.env.YANDEX_TOKEN}`,
      },
      formData: {
        file: {
          value: buffer,
          options: {
            filename: image_name,
          },
        },
      },
      json: true,
    });

    console.log({ [image_name]: result });
  }
})();
