import axios from "axios";
import * as FileSystem from "expo-file-system";

const uploadToCloudinary = async (uri: string) => {
  const cloudName = "dwyso05qz";
  const uploadPreset = "final-product";

  const fileType = uri.split(".").pop();

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const formData = new FormData();
  formData.append("file", `data:image/${fileType};base64,${base64}`);
  formData.append("upload_preset", uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.secure_url;
};

export default uploadToCloudinary;
