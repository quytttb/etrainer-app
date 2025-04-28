import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import QuestionRenderer4 from "./QuestionRenderer4";
import { Question } from "../type";

interface PracticeType4Props {
  questions: Question[];
  onBack?: () => void;
  onSubmit?: (questionAnswers: any[]) => void;
  isViewMode?: boolean;
  questionId?: string;
  toggleExplanation?: any;
}

const PracticeType4 = ({
  questions,
  onBack,
  onSubmit,
  isViewMode,
  questionId,
  toggleExplanation,
}: PracticeType4Props) => {
  const questionList = questions;
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q._id}`] = q.userAnswer || "";
  });

  const handleBack = async () => {
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

    onSubmit?.(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onFormSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
        const currentQuestion = questionList[currentQuestionIndex];

        const isHiddenSubmit =
          currentQuestionIndex === questionList.length - 1 && isViewMode;

        useEffect(() => {
          if (questionId) {
            const index = questionList.findIndex((q) => q._id === questionId);
            if (index !== -1) {
              setCurrentQuestionIndex(index);
            }
          }
        }, [questionId]);

        const goToNextQuestion = () => {
          if (currentQuestionIndex < questionList.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            handleSubmit();
          }
        };

        const goToPrevQuestion = () => {
          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
          }
        };

        const handleSelectAnswer = (option: string) => {
          if (isViewMode) return;

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
            isViewMode={isViewMode}
            isHiddenSubmit={isHiddenSubmit}
            toggleExplanation={toggleExplanation}
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType4;
