import request from "@/api/request";

interface INotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const getNotificationService = (): Promise<INotification[]> => {
  return request.get("/notification");
};
