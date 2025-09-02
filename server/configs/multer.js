// import multer from "multer";

// const storage = multer.diskStorage({});

// const upload = multer({ storage });

// export default upload;

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage,limits: { fileSize: 25 * 1024 * 1024 }, });
export default upload 

