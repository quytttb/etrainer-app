import PracticeType1 from "@/components/Practice/PracticeType1/PracticeType1";
import Prepare from "@/components/Prepare";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { startPracticeService, submitPracticeService } from "./service";
import { Alert, Text } from "react-native";
import dayjs from "dayjs";
import PracticeType3 from "@/components/Practice/PracticeType3/PracticeType3";
import PracticeType2 from "@/components/Practice/PracticeType2/PracticeType2";
import PracticeType4 from "@/components/Practice/PracticeType4/PracticeType4";
import PracticeType5 from "@/components/Practice/PracticeType5/PracticeType5";
import PracticeType6 from "@/components/Practice/PracticeType6/PracticeType6";

const Practice = () => {
  const params = useLocalSearchParams();
  const type = params.lessonType as LESSON_TYPE;

  const [step, setStep] = useState<"PREPARE" | "PRACTICE">("PREPARE");
  const [startTime, setStartTime] = useState<string | null>(null);

  const { type1, type2, type3, type4, type5, type6 } = useMemo(() => {
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
      setStartTime(dayjs().toISOString());
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi bắt đầu luyện tập");
    },
  });

  const submitPracticeMutation = useMutation({
    mutationKey: ["SUBMIT_PRACTICE"],
    mutationFn: submitPracticeService,
    onSuccess: (r) => {
      router.replace({
        pathname: `/practice/result/${r.data._id}`,
      });
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi bài luyện tập");
    },
  });

  const onStart = () => {
    startPracticeMutation.mutate({
      type,
      count: 6,
    });
  };

  const onSubmit = (questionAnswers: any) => {
    submitPracticeMutation.mutate({
      startTime: startTime as string,
      endTime: dayjs().toISOString(),
      lessonType: type,
      questionAnswers: questionAnswers,
    });
  };

  if (step === "PREPARE") {
    return <Prepare type={type} onStart={onStart} />;
  }

  if (type1) {
    return (
      <PracticeType1
        onSubmit={onSubmit}
        questions={startPracticeMutation.data}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  if (type2) {
    return (
      <PracticeType2
        onSubmit={onSubmit}
        questions={startPracticeMutation.data}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  if (type3) {
    return (
      <PracticeType3
        questions={startPracticeMutation.data}
        onSubmit={onSubmit}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  if (type4) {
    return (
      <PracticeType4
        questions={startPracticeMutation.data}
        onSubmit={onSubmit}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  if (type5) {
    return (
      <PracticeType5
        questions={startPracticeMutation.data}
        onSubmit={onSubmit}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  if (type6) {
    return (
      <PracticeType6
        questions={startPracticeMutation.data}
        onSubmit={onSubmit}
        onBack={() => setStep("PREPARE")}
      />
    );
  }
};

export default Practice;
