import cloudinary from "../services/cloudinary.js";

const ensureCloudinaryConfigured = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary not configured");
  }
};

export const getUploadSignature = async (req, res) => {
  try {
    ensureCloudinaryConfigured();

    const timestamp = Math.round(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "memories";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.status(200).json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to sign upload." });
  }
};
