import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import { Question } from "@/components/Practice/type";
import QuestionRenderer from "@/components/Practice/PracticeType2/QuestionRenderer2";

interface PracticeType2ExamProps {
  questions: Question[];
  onBack?: () => void;
  onSubmit: (questionAnswers: any[]) => void;
  initialQuestionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
}

const PracticeType2_Exam = ({
  questions,
  onBack,
  onSubmit,
  initialQuestionIndex = 0,
  onQuestionIndexChange,
}: PracticeType2ExamProps) => {
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
          if (currentQuestionIndex > 0) {
            if (audioPlayerRef.current) {
              await audioPlayerRef.current.reset();
            }
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            onQuestionIndexChange?.(currentQuestionIndex - 1);
          } else {
            onBack?.();
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

export default PracticeType2_Exam;
