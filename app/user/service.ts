import request from "@/api/request";
import uploadToCloudinary from "@/utils/uploadImage";

interface IUpdateProfilePayload {
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  avatarUri: string;
}

export const updateProfileService = async ({
  avatarUri,
  ...data
}: IUpdateProfilePayload) => {
  const payload: any = data;

  if (avatarUri) {
    const avatarUrl = await uploadToCloudinary(avatarUri);
    payload.avatarUrl = avatarUrl;
  }

  return request.put("/users/profile", payload);
};
