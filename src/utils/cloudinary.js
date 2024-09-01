/**
 * This function uploads a local file to Cloudinary.
 *
 * @param {string} localFilePath - The path to the local file to be uploaded.
 * @returns {Promise<Object|null>} - A Promise that resolves to the Cloudinary response object if the upload is successful,
 * or null if the upload fails or the localFilePath is not provided.
 *
 * The Cloudinary response object will contain the following properties:
 * - public_id: The unique identifier of the uploaded file.
 * - version: The version of the uploaded file.
 * - signature: The signature of the uploaded file.
 * - width: The width of the uploaded file.
 * - height: The height of the uploaded file.
 * - format: The format of the uploaded file.
 * - resource_type: The type of the uploaded file (e.g., "image").
 * - created_at: The date and time when the file was created.
 * - tags: An array of tags associated with the uploaded file.
 * - bytes: The size of the uploaded file in bytes.
 * - type: The type of the uploaded file (e.g., "upload").
 * - url: The URL of the uploaded file.
 * - secure_url: The secure URL of the uploaded file.
 *
 * If the upload fails, the function will log an error message and remove the locally saved temporary file.
 * It will then return null.
 * 
 */
import cloudinary from 'cloudinary';
import fs from 'fs';

// Initialize Cloudinary with your Cloudinary credentials

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        console.log("File is uploaded Successfully!", response.url);
        // After file is uploaded
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation got failed.
        return null;
    }
};

export {uploadFileOnCloudinary}