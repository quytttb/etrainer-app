import request from "@/api/request";

export interface IGrammar {
  _id: string;
  topic: string;
  grammars: IGrammarLesson[];
  createdAt: string;
  updatedAt: string;
}

export interface IGrammarLesson {
  _id: string;
  title: string;
  content: string;
  examples: string[];
  relatedGrammars: {
    title: string;
    content: string;
    examples: string[];
  }[];
}

export const getGrammarListService = (): Promise<IGrammar[]> => {
  return request.get("/grammar", {
    params: {
      sortBy: "createdAt",
    },
  });
};

export const getGrammarByIdService = (id: string): Promise<IGrammar> => {
  return request.get(`/grammar/${id}`);
};
