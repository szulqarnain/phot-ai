import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { removeObject } from "./phot-ai";

const app = express();
const port = 3002;

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use("src/uploads", express.static(path.join(__dirname, "uploads")));

// POST endpoint for handling file uploads
app.post(
  "/",
  upload.fields([{ name: "source" }, { name: "object" }]),
  async (req: any, res) => {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }

    // Get the source and object files
    const sourceFile = req.files.source ? req.files.source[0] : null;
    const objectFile = req.files.object ? req.files.object[0] : null;

    if (sourceFile && objectFile) {
      console.log("Source File:", sourceFile);
      console.log("Object File:", objectFile);

      // Generate live URL for the source file
      //   const sourceFileUrl = `http://localhost:3002/src/uploads/${sourceFile.filename}`;

      // Generate live URL for the source file dynamically
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const sourceFileUrl = `${baseUrl}/src/uploads/${sourceFile.filename}`;

      console.log("sourceFileUrl", sourceFileUrl);

      // Read object file
      const objectFilePath = path.join(
        __dirname,
        "/uploads",
        objectFile.filename
      ); // Adjust to full path

      const objectFileData = await fs.promises.readFile(objectFilePath);
      const objectFileBase64 = objectFileData.toString("base64");

      const response = await removeObject(
        sourceFile.filename,
        sourceFileUrl,
        objectFileBase64
      );

      res.send({ ...response });
    } else {
      res.status(400).send("Both source and object files are required.");
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
