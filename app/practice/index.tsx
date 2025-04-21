import Prepare from "@/components/Prepare";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";

const Practice = () => {
  const params = useLocalSearchParams();
  const type = params.lessonType as LESSON_TYPE;

  const [step, setStep] = useState<"PREPARE" | "PRACTICE">("PREPARE");

  const { type1, type2, type3, type4, type5 } = useMemo(() => {
    const type1 = [LESSON_TYPE.IMAGE_DESCRIPTION].includes(type);
    const type2 = [LESSON_TYPE.ASK_AND_ANSWER].includes(type);
    const type3 = [
      LESSON_TYPE.CONVERSATION_PIECE,
      LESSON_TYPE.SHORT_TALK,
    ].includes(type);
    const type4 = [LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION].includes(type);
    const type5 = [
      LESSON_TYPE.FILL_IN_THE_PARAGRAPH,
      LESSON_TYPE.READ_AND_UNDERSTAND,
    ].includes(type);

    return { type1, type2, type3, type4, type5 };
  }, [type]);

  if (step === "PREPARE") {
    return <Prepare type={type} />;
  }

  return <></>;
};

export default Practice;
