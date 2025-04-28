import PracticeType1 from "@/components/Practice/PracticeType1/PracticeType1";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import PracticeType3 from "@/components/Practice/PracticeType3/PracticeType3";
import PracticeType2 from "@/components/Practice/PracticeType2/PracticeType2";
import PracticeType4 from "@/components/Practice/PracticeType4/PracticeType4";
import PracticeType5 from "@/components/Practice/PracticeType5/PracticeType5";
import PracticeType6 from "@/components/Practice/PracticeType6/PracticeType6";
import { useQuery } from "@tanstack/react-query";
import { getPracticeResultService } from "../service";
import { Question } from "@/components/Practice/type";

const PracticeHistory = () => {
  const { id, questionId } = useLocalSearchParams();

  const { data } = useQuery({
    queryKey: ["PRACTICE_HISTORY", id],
    queryFn: () => getPracticeResultService(id as string),
    enabled: !!id,
  });

  const { type1, type2, type3, type4, type5, type6 } = useMemo(() => {
    const type = data?.lessonType;

    if (!type)
      return {
        type1: false,
        type2: false,
        type3: false,
        type4: false,
        type5: false,
        type6: false,
      };

    const type1 = [LESSON_TYPE.IMAGE_DESCRIPTION].includes(type);
    const type2 = [LESSON_TYPE.ASK_AND_ANSWER].includes(type);
    const type3 = [
      LESSON_TYPE.CONVERSATION_PIECE,
      LESSON_TYPE.SHORT_TALK,
    ].includes(type);
    const type4 = [LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION].includes(type);
    const type5 = [LESSON_TYPE.FILL_IN_THE_PARAGRAPH].includes(type);
    const type6 = [LESSON_TYPE.READ_AND_UNDERSTAND].includes(type);

    return { type1, type2, type3, type4, type5, type6 };
  }, [data?.lessonType]);

  const questions = data?.questionAnswers as Question[];

  const props = {
    questions: questions,
    onBack: router.back,
    isViewMode: true,
    questionId: questionId as string,
  };

  if (type1) {
    return <PracticeType1 {...props} />;
  }

  if (type2) {
    return <PracticeType2 {...props} />;
  }

  if (type3) {
    return <PracticeType3 {...props} />;
  }

  if (type4) {
    return <PracticeType4 {...props} />;
  }

  if (type5) {
    return <PracticeType5 {...props} />;
  }

  if (type6) {
    return <PracticeType6 {...props} />;
  }
};

export default PracticeHistory;
