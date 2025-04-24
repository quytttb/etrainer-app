import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import QuestionRenderer4 from "@/components/Practice/PracticeType4/QuestionRenderer4";
import { Question } from "@/components/Practice/type";

interface PracticeType4ExamProps {
  questions: Question[];
  onBack?: () => void;
  onSubmit: (questionAnswers: any[]) => void;
  initialQuestionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
}

const PracticeType4_Exam = ({
  questions,
  onBack,
  onSubmit,
  initialQuestionIndex = 0,
  onQuestionIndexChange,
}: PracticeType4ExamProps) => {
  const questionList = questions;
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q._id}`] = "";
  });

  const handleBack = () => {
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
      onSubmit={onFormSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] =
          useState(initialQuestionIndex);
        const currentQuestion = questionList[currentQuestionIndex];

        const goToNextQuestion = () => {
          if (currentQuestionIndex < questionList.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            onQuestionIndexChange?.(currentQuestionIndex + 1);
          } else {
            handleSubmit();
          }
        };

        const goToPrevQuestion = () => {
          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            onQuestionIndexChange?.(currentQuestionIndex - 1);
          } else {
            // Khi ở câu đầu tiên, gọi onBack để quay lại màn intro
            if (onBack) onBack();
          }
        };

        const handleSelectAnswer = (option: string) => {
          setFieldValue(`question_${currentQuestion._id}`, option);
        };

        return (
          <QuestionRenderer4
            currentQuestionIndex={currentQuestionIndex}
            questionList={questionList}
            currentQuestion={currentQuestion}
            values={values}
            handleBack={handleBack}
            goToNextQuestion={goToNextQuestion}
            goToPrevQuestion={goToPrevQuestion}
            handleSelectAnswer={handleSelectAnswer}
            hideHeader={true}
            showWrongAnswer={false}
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType4_Exam;
