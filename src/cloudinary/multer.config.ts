import { diskStorage } from 'multer';
import { extname } from 'path';
export const multerConfig = {

  storage: diskStorage({
    destination: './uploads', // Define the destination folder
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      console.log(uniqueSuffix);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Allowed file types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true); // Accept the file
    } else {
      callback(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // Reject the file
    }
  },
};