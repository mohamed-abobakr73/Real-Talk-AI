import multer from "multer";

const upload = multer({ limits: { fileSize: 1 * 1024 * 1024 } });

export default upload;
