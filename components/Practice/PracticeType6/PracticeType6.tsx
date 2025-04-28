import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import QuestionRenderer5 from "./QuestionRenderer6";
import { Question } from "../type";

interface PracticeType6Props {
  questions: Question[];
  onBack?: () => void;
  onSubmit?: (questionAnswers: any[]) => void;
  isViewMode?: boolean;
  questionId?: string;
  toggleExplanation?: any;
}

const PracticeType6 = ({
  questions,
  onBack,
  onSubmit,
  isViewMode,
  questionId,
  toggleExplanation,
}: PracticeType6Props) => {
  const questionList = questions;
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    if (q.questions && q.questions.length > 0) {
      q.questions.forEach((subQ) => {
        initialValues[`question_${q._id}_${subQ._id}`] = subQ.userAnswer || "";
      });
    } else {
      initialValues[`question_${q._id}`] = q.userAnswer || "";
    }
  });

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const onFormSubmit = async (values: Record<string, string>) => {
    const payload = questionList.map((it) => {
      const questions = it.questions.map((subQ) => {
        const userAnswer = values[`question_${it._id}_${subQ._id}`];
        const correctAnswer = subQ.answers.find((ans) => ans.isCorrect);
        const isCorrect = userAnswer === correctAnswer?._id;
        const isNotAnswer = !userAnswer;

        return {
          ...subQ,
          userAnswer,
          isCorrect,
          isNotAnswer,
        };
      });

      return {
        ...it,
        questions,
      };
    });

    onSubmit?.(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
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

        const handleSelectAnswer = (option: string, subQuestionId?: string) => {
          if (isViewMode) return;

          if (subQuestionId) {
            setFieldValue(
              `question_${currentQuestion._id}_${subQuestionId}`,
              option
            );
          } else {
            setFieldValue(`question_${currentQuestion._id}`, option);
          }
        };

        return (
          <QuestionRenderer5
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

export default PracticeType6;
