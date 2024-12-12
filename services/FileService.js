import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class FileService {
  /**
   * Upload a file to a specified path.
   * @param {Object} file - The file object to be uploaded.
   * @param {String} uploadPath - The path where the file will be saved.
   * @param {Function} callback - Optional callback function to execute after upload.
   * @returns {Promise<String>} - The unique filename of the uploaded file.
   * @throws {Error} - Throws an error if the upload fails.
   */
  async uploadFile(file, uploadPath, callback) {
    // Validate that the file exists
    if (!file || !file.name) {
      throw new Error("No file provided");
    }

    // Get the file extension and validate it if needed
    const fileExt = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"]; // Example allowed file types

    if (!allowedExtensions.includes(fileExt)) {
      throw new Error(
        "Invalid file type. Allowed types: " + allowedExtensions.join(", ")
      );
    }

    // Create a unique filename
    const uniqueFilename = `${uuidv4()}.${fileExt}`;
    const uploadPathFull = path.join(uploadPath, uniqueFilename);

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    try {
      // Use promise to handle file movement
      await new Promise((resolve, reject) => {
        file.mv(uploadPathFull, (err) => {
          if (err) {
            reject(new Error("Failed to move the file: " + err.message));
          } else {
            resolve();
          }
        });
      });

      // If a callback is provided, execute it
      if (callback && typeof callback === "function") {
        callback(uniqueFilename);
      }

      return uniqueFilename;
    } catch (error) {
      throw new Error("File upload failed: " + error.message);
    }
  }
}

export default new FileService();
