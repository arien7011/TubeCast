/**
 * This function configures multer storage settings for handling file uploads.
 * It uses the diskStorage strategy, which saves uploaded files to the specified destination.
 *
 * @param {Object} multer - The multer module for handling file uploads.
 *
 * @returns {Object} An instance of multer with the configured storage settings.
 *
 * @example
 * import multer from "./multer.js"
 * import { upload } from "./fileUpload.js"
 *
 * const app = express();
 * app.use(upload.single('file'));
 *
 * app.post('/upload', (req, res) => {
 *   // Handle the uploaded file
 * });
 */
import multer from "multer"

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./public/temp");
    },
    filename : function(req,file,cb){
        cb(null,file.originalName);
    }
})



export const upload = multer({storage})
