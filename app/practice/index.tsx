import PracticeType1 from "@/components/Practice/PracticeType1/PracticeType1";
import PracticeType2 from "@/components/Practice/PracticeType2/PracticeType2";
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

  const onStart = () => {
    setStep("PRACTICE");
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
        questions={[
          {
            audio: {
              name: "BẮC BLING (BẮC NINH) ｜ OFFICIAL MV ｜ HOÀ MINZY ft NS XUÂN HINH x MASEW x TUẤN CRY.m4a",
              url: "https://res.cloudinary.com/dwyso05qz/video/upload/v1744543083/y8vde5uij3ehkwfuzng3.mp4",
            },
            _id: "67fb9d6c4f38816022f6a2f5",
            type: "IMAGE_DESCRIPTION",
            question: null,
            imageUrl:
              "https://res.cloudinary.com/dwyso05qz/image/upload/v1744543081/c8rj2i64oci0otmhijrn.jpg",
            answers: [
              {
                answer: "A",
                isCorrect: true,
                _id: "67fb9d6c4f38816022f6a2f6",
              },
              {
                answer: "B",
                isCorrect: false,
                _id: "67fb9d6c4f38816022f6a2f7",
              },
              {
                answer: "C",
                isCorrect: false,
                _id: "67fb9d6c4f38816022f6a2f8",
              },
            ],
            questions: null,
            createdAt: "2025-04-13T11:18:04.064Z",
            updatedAt: "2025-04-13T11:18:04.064Z",
            questionNumber: 14,
            __v: 0,
          },
          {
            audio: {
              name: "BẮC BLING (BẮC NINH) ｜ OFFICIAL MV ｜ HOÀ MINZY ft NS XUÂN HINH x MASEW x TUẤN CRY.m4a",
              url: "https://res.cloudinary.com/dwyso05qz/video/upload/v1744541877/thecr0fy6tziant0aky9.mp4",
            },
            _id: "67fb98b64c8466b54afc1db6",
            type: "IMAGE_DESCRIPTION",
            question: null,
            imageUrl:
              "https://res.cloudinary.com/dwyso05qz/image/upload/v1744541877/fn0lyn5urckadwn2va9w.jpg",
            answers: [
              {
                answer: "A",
                isCorrect: false,
                _id: "67fb98b64c8466b54afc1db7",
              },
              {
                answer: "B",
                isCorrect: false,
                _id: "67fb98b64c8466b54afc1db8",
              },
              {
                answer: "C",
                isCorrect: true,
                _id: "67fb98b64c8466b54afc1db9",
              },
            ],
            questions: null,
            createdAt: "2025-04-13T10:57:58.369Z",
            updatedAt: "2025-04-13T10:57:58.369Z",
            questionNumber: 4,
            __v: 0,
          },
        ]}
      />
    );
  }

  if (type2) {
    return <PracticeType2 />;
  }
};

export default Practice;
