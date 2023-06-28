const __dirname = path.dirname(new URL(import.meta.url).pathname);
const path = require("path");
const fs = require("fs");
const request = require("request-promise");
const dialogs_config = require("./configs/dialogs");

(async () => {
  const result_dir = path.resolve(__dirname, "./images/result"),
    images = fs
      .readdirSync(result_dir)
      .filter((name) => name.search(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i) !== -1);
  for (let image_name of images) {
    const buffer = fs.readFileSync(`${result_dir}/${image_name}`);

    let result = await request.post({
      url: `https://dialogs.yandex.net/api/v1/skills/${dialogs_config.skill_id}/images`,
      headers: {
        Authorization: `OAuth ${dialogs_config.token}`,
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
