import PracticeType1 from "@/components/Practice/PracticeType1/PracticeType1";
import PracticeType2 from "@/components/Practice/PracticeType2/PracticeType2";
import Prepare from "@/components/Prepare";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { startPracticeService } from "./service";
import { Alert } from "react-native";

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

  const startPracticeMutation = useMutation({
    mutationKey: ["START_PRACTICE"],
    mutationFn: startPracticeService,
    onSuccess: (r) => {
      if (!r.length) {
        Alert.alert("Lỗi", "Không có câu hỏi nào để luyện tập");
        return;
      }
      setStep("PRACTICE");
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi bắt đầu luyện tập");
    },
  });

  const onStart = () => {
    startPracticeMutation.mutate({
      type,
      count: 6,
    });
  };

  if (step === "PREPARE") {
    return <Prepare type={type} onStart={onStart} />;
  }

  if (type1) {
    return (
      <PracticeType1
        onSubmit={(values) => {
          console.log("Submitted values:", values);
        }}
        questions={startPracticeMutation.data}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  if (type2) {
    return <PracticeType2 />;
  }
};

export default Practice;
