import request from "@/api/request";

export const loginService = (payload: { email: string; password: string }) => {
  return request.post("/auth/login", payload);
};

export const registerService = (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  return request.post("/auth/register", payload);
};
