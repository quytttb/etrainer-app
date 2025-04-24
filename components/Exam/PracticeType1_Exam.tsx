import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import QuestionRenderer from "@/components/Practice/PracticeType1/QuestionRenderer";
import { Question } from "@/components/Practice/type";

interface PracticeType1ExamProps {
  questions: Question[];
  onBack?: () => void;
  onSubmit: (questionAnswers: any[]) => void;
  initialQuestionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
}

const PracticeType1_Exam = ({
  questions,
  onBack,
  onSubmit,
  initialQuestionIndex = 0,
  onQuestionIndexChange,
}: PracticeType1ExamProps) => {
  const questionList = questions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q._id}`] = "";
  });

  const handleBack = async () => {
    await audioPlayerRef.current?.reset();
    if (onBack) onBack();
    else navigation.goBack();
  };

  const onFormSubmit = async (values: Record<string, string>) => {
    const payload = questionList.map((it) => {
      const userAnswer = values[`question_${it._id}`];
      const correctAnswer = it.answers.find((ans) => ans.isCorrect);
      const isCorrect = userAnswer === correctAnswer?._id;
      const isNotAnswer = !userAnswer;
      return {
        ...it,
        userAnswer,
        isCorrect,
        isNotAnswer,
      };
    });
    onSubmit(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        if (audioPlayerRef.current) {
          await audioPlayerRef.current.reset();
        }
        onFormSubmit(values);
      }}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] =
          useState(initialQuestionIndex);
        const currentQuestion = questionList[currentQuestionIndex];
        const isLastSection = false; // Không có thông tin section cuối ở đây, sẽ truyền prop nếu cần
        const isLastQuestion = currentQuestionIndex === questionList.length - 1;
        const isSubmit = isLastQuestion && isLastSection;

        const goToNextQuestion = async () => {
          if (currentQuestionIndex < questionList.length - 1) {
            if (audioPlayerRef.current) {
              await audioPlayerRef.current.reset();
            }
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            onQuestionIndexChange?.(currentQuestionIndex + 1);
          } else {
            handleSubmit();
          }
        };

        const goToPrevQuestion = async () => {
          if (audioPlayerRef.current) {
            await audioPlayerRef.current.reset();
          }

          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            onQuestionIndexChange?.(currentQuestionIndex - 1);
          } else {
            onBack?.(); // Khi ở câu đầu tiên, gọi
            // Khi ở câu đầu tiên, gọi onBack để
          }
        };

        const handleSelectAnswer = (option: string) => {
          setFieldValue(`question_${currentQuestion._id}`, option);
        };

        return (
          <QuestionRenderer
            currentQuestionIndex={currentQuestionIndex}
            questionList={questionList}
            currentQuestion={currentQuestion}
            values={values}
            audioPlayerRef={audioPlayerRef}
            handleBack={handleBack}
            goToNextQuestion={goToNextQuestion}
            goToPrevQuestion={goToPrevQuestion}
            handleSelectAnswer={handleSelectAnswer}
            hideHeader={true}
            showWrongAnswer={false}
            disabledPrevButton={false}
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType1_Exam;
