import { LESSON_TYPE } from "@/constants/lesson-types";
import { ImageSourcePropType } from "react-native";

export const HOME_CONFIG: {
  title: string;
  data: {
    partNumber?: number;
    icon: ImageSourcePropType;
    type: LESSON_TYPE;
  }[];
}[] = [
  {
    title: "Luyện nghe",
    data: [
      {
        partNumber: 1,
        icon: require("../../assets/images/image_icon.png"),
        type: LESSON_TYPE.IMAGE_DESCRIPTION,
      },
      {
        partNumber: 2,
        icon: require("../../assets/images/qa.png"),
        type: LESSON_TYPE.ASK_AND_ANSWER,
      },
      {
        partNumber: 3,
        icon: require("../../assets/images/chat.png"),
        type: LESSON_TYPE.CONVERSATION_PIECE,
      },
      {
        partNumber: 4,
        icon: require("../../assets/images/headphones.png"),
        type: LESSON_TYPE.SHORT_TALK,
      },
    ],
  },
  {
    title: "Luyện đọc",
    data: [
      {
        partNumber: 5,
        icon: require("../../assets/images/vocabulary.png"),
        type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
      },
      {
        partNumber: 6,
        icon: require("../../assets/images/form.png"),
        type: LESSON_TYPE.FILL_IN_THE_PARAGRAPH,
      },
      {
        partNumber: 7,
        icon: require("../../assets/images/voca_icon.png"),
        type: LESSON_TYPE.READ_AND_UNDERSTAND,
      },
    ],
  },
  {
    title: "Lý thuyết",
    data: [
      {
        icon: require("../../assets/images/vocabulary.png"),
        type: LESSON_TYPE.VOCABULARY,
      },
      {
        icon: require("../../assets/images/form.png"),
        type: LESSON_TYPE.GRAMMAR,
      },
    ],
  },
];
