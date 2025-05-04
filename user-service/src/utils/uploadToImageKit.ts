import imagekitClient from "../config/imageKit";

const uploadToImageKit = async (fileBuffer: string, username: string) => {
  const image = await imagekitClient.upload({
    file: Buffer.from(fileBuffer),
    fileName: `${username} ${Date.now()}.jpg`,
    extensions: [
      {
        name: "google-auto-tagging",
        maxTags: 5,
        minConfidence: 95,
      },
    ],
  });
  return image;
};

export default uploadToImageKit;
