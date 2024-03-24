import path from 'path';
import { promises as fsPromises } from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dialogs_config from './configs/dialogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    const result_dir = path.resolve(__dirname, "./images/result"),
          images = await fsPromises.readdir(result_dir);
    const imageFiles = images.filter((name) => name.match(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i));

    for (let image_name of imageFiles) {
      const imagePath = `${result_dir}/${image_name}`;
      const buffer = await fsPromises.readFile(imagePath);

      const formData = new FormData();
      formData.append('file', buffer, image_name);

      const result = await axios.post(`https://dialogs.yandex.net/api/v1/skills/${dialogs_config.skill_id}/images`, formData, {
        headers: {
          'Authorization': `OAuth ${dialogs_config.token}`,
          ...formData.getHeaders(),
        },
      });

      console.log({ [image_name]: result.data });
    }
  } catch (error) {
    console.error("Error uploading images:", error);
  }
})();
