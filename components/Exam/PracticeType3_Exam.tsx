import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import QuestionRenderer from "@/components/Practice/PracticeType3/QuestionRenderer";
import { Question } from "@/components/Practice/type";

interface PracticeType3ExamProps {
  questions: Question[];
  onBack?: () => void;
  onSubmit: (questionAnswers: any[]) => void;
  initialQuestionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
}

const PracticeType3_Exam = ({
  questions,
  onBack,
  onSubmit,
  initialQuestionIndex = 0,
  onQuestionIndexChange,
}: PracticeType3ExamProps) => {
  const questionList = questions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    if (q.questions && q.questions.length > 0) {
      q.questions.forEach((subQ) => {
        initialValues[`question_${q._id}_${subQ._id}`] = "";
      });
    } else {
      initialValues[`question_${q._id}`] = "";
    }
  });

  const handleBack = async () => {
    if (audioPlayerRef.current) {
      await audioPlayerRef.current.reset();
    }
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
          }
        };

        const handleSelectAnswer = (option: string, subQuestionId?: string) => {
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
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType3_Exam;
