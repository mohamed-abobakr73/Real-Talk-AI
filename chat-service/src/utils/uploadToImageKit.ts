import imagekitClient from "../config/imageKit";

const uploadToImageKit = async (
  fileBuffer: string,
  username: string = "user"
) => {
  const image = await imagekitClient.upload({
    file: Buffer.from(fileBuffer),
    fileName: `${username} ${Date.now()}`,
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
