import multer from "multer";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ok = file.mimetype?.startsWith("image/");
  if (!ok) return cb(new Error("Only image files are allowed"), false);
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB each
});
