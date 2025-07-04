import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import QuestionRenderer6 from "@/components/Practice/PracticeType6/QuestionRenderer6";
import { Question } from "@/components/Practice/type";
import AudioManager from "@/app/journeyNew/utils/AudioManager";

interface PracticeType5ExamProps {
  questions: Question[];
  onBack?: () => void;
  onSubmit: (questionAnswers: any[]) => void;
  initialQuestionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
  initialValues: Question[];
  onValuesChange?: (values: any[]) => void;
  showWrongAnswer?: boolean;
  isViewMode?: boolean;
}

const PracticeType6_Exam = ({
  questions,
  onBack,
  onSubmit,
  initialQuestionIndex = 0,
  onQuestionIndexChange,
  initialValues: initialValuesProps,
  onValuesChange,
  showWrongAnswer = false,
  isViewMode,
}: PracticeType5ExamProps) => {
  const questionList = initialValuesProps ?? questions;
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    if (q.questions && q.questions.length > 0) {
      q.questions.forEach((subQ) => {
        initialValues[`question_${q._id}_${subQ._id}`] = subQ?.userAnswer ?? "";
      });
    } else {
      initialValues[`question_${q._id}`] = q?.userAnswer ?? "";
    }
  });

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const processFormValues = (values: Record<string, string>) => {
    return questionList.map((it) => {
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
  };

  const onFormSubmit = (values: Record<string, string>) => {
    const payload = processFormValues(values);
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

        useEffect(() => {
          const payload = processFormValues(values);
          onValuesChange?.(payload);
        }, [values, onValuesChange]);

        const goToNextQuestion = async () => {
          if (currentQuestionIndex < questionList.length - 1) {
            try {
              await AudioManager.pauseAllAudio();
              console.log('🎵 Audio paused when going to next question in Exam');
            } catch (error) {
              console.error('❌ Error pausing audio:', error);
            }
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            onQuestionIndexChange?.(currentQuestionIndex + 1);
          } else {
            handleSubmit();
          }
        };

        const goToPrevQuestion = async () => {
          try {
            await AudioManager.pauseAllAudio();
            console.log('🎵 Audio paused when going to previous question in Exam');
          } catch (error) {
            console.error('❌ Error pausing audio:', error);
          }
          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            onQuestionIndexChange?.(currentQuestionIndex - 1);
          } else {
            if (onBack) onBack();
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
          <QuestionRenderer6
            currentQuestionIndex={currentQuestionIndex}
            questionList={questionList}
            currentQuestion={currentQuestion}
            values={values}
            handleBack={handleBack}
            goToNextQuestion={goToNextQuestion}
            goToPrevQuestion={goToPrevQuestion}
            handleSelectAnswer={handleSelectAnswer}
            hideHeader={true}
            showWrongAnswer={showWrongAnswer}
            disabledPrevButton={false}
            isSubmit
            isViewMode={isViewMode}
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType6_Exam;
