import request from "@/api/request";

interface IVocabulary {
  _id: string;
  topicName: string;
  words: {
    _id: string;
    word: string;
    meaning: string;
    pronunciation: string;
    audio: { url: string };
    audioName: string;
  }[];
}

export const getVocabularyListService = async (): Promise<IVocabulary[]> => {
  return request.get("/vocabulary", {
    params: {
      sortBy: "createdAt",
    },
  });
};

export const getVocabularyByIdService = async (
  id: string
): Promise<IVocabulary> => {
  return request.get(`/vocabulary/${id}`);
};
