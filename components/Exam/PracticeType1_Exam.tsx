import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import QuestionRenderer from "@/components/Practice/PracticeType1/QuestionRenderer";
import { Question } from "@/components/Practice/type";
import AudioManager from "@/app/journeyNew/utils/AudioManager";

interface PracticeType1ExamProps {
  questions: Question[];
  onBack?: () => void;
  onSubmit: (questionAnswers: any[]) => void;
  initialQuestionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
  initialValues: Question[];
  onValuesChange?: (values: any[]) => void;
  examRef: any;
  showWrongAnswer?: boolean;
  isViewMode?: boolean;
}

const PracticeType1_Exam = ({
  questions,
  onBack,
  onSubmit,
  initialQuestionIndex = 0,
  onQuestionIndexChange,
  initialValues: initialValuesProps,
  onValuesChange,
  examRef,
  showWrongAnswer = false,
  isViewMode,
}: PracticeType1ExamProps) => {
  const questionList = initialValuesProps ?? questions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q._id}`] = q?.userAnswer ?? "";
  });

  useImperativeHandle(examRef, () => ({
    reset: async () => {
      if (audioPlayerRef.current) {
        await audioPlayerRef.current.reset();
      }
    },
  }));

  const handleBack = async () => {
    await audioPlayerRef.current?.reset();
    if (onBack) onBack();
    else navigation.goBack();
  };

  const processFormValues = (values: Record<string, string>) => {
    return questionList.map((it) => {
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
  };

  const onFormSubmit = async (values: Record<string, string>) => {
    const payload = processFormValues(values);
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

        useEffect(() => {
          const payload = processFormValues(values);
          onValuesChange?.(payload);
        }, [values, onValuesChange]);

        const goToNextQuestion = async () => {
          if (currentQuestionIndex < questionList.length - 1) {
            // ✅ FIX: Pause all audio khi chuyển câu hỏi theo đề xuất của user 
            try {
              await AudioManager.pauseAllAudio();
              console.log('🎵 Audio paused when going to next question in Exam');
            } catch (error) {
              console.error('❌ Error pausing audio:', error);
            }

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
          // ✅ FIX: Pause all audio khi chuyển câu hỏi theo đề xuất của user
          try {
            await AudioManager.pauseAllAudio();
            console.log('🎵 Audio paused when going to previous question in Exam');
          } catch (error) {
            console.error('❌ Error pausing audio:', error);
          }

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
          if (isViewMode) return;

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
            showWrongAnswer={showWrongAnswer}
            disabledPrevButton={false}
            isSubmit={false}
            isViewMode={isViewMode}
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType1_Exam;
