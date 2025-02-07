import cloudinary from "../lib/cloudinary";

export const UploadFileToCloudinary = async (file: File, folder: string) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  console.log("Bytes", bytes);

  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder || "show-spot",
        },
        async (err, result) => {
          if (err) {
            return reject(err.message);
          }
          console.log("Result", result);
          return resolve(result);
        }
      )
      .end(bytes);
  });
};
