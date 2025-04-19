import request from "@/api/request";

export const loginService = (payload: { email: string; password: string }) => {
  return request.post("/auth/login", payload);
};
