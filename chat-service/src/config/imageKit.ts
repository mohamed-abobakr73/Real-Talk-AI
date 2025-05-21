import ImageKit from "imagekit";
import { configDotenv } from "dotenv";

configDotenv();

const IMAGE_KIT_PUBLIC_API_KEY = process.env.IMAGE_KIT_PUBLIC_API_KEY!;
const IMAGE_KIT_PRIVATE_API_KEY = process.env.IMAGE_KIT_PRIVATE_API_KEY!;
const IMAGE_KIT_URL_ENDPONIT = process.env.IMAGE_KIT_URL_ENDPONIT!;

const imagekitClient = new ImageKit({
  publicKey: IMAGE_KIT_PUBLIC_API_KEY,
  privateKey: IMAGE_KIT_PRIVATE_API_KEY,
  urlEndpoint: IMAGE_KIT_URL_ENDPONIT,
});

export default imagekitClient;
