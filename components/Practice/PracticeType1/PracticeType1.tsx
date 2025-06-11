import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import QuestionRenderer from "./QuestionRenderer";
import { Question } from "../type";

interface PracticeType1Props {
  questions: Question[];
  onBack?: () => void;
  onSubmit?: (questionAnswers: any[]) => void;
  isViewMode?: boolean;
  questionId?: string;
  toggleExplanation?: (data?: {
    subtitle: string;
    explanation: string;
  }) => void;
}

const PracticeType1 = (
  {
    questions,
    onBack,
    onSubmit,
    isViewMode,
    questionId,
    toggleExplanation,
  }: PracticeType1Props,
  ref: any
) => {
  const questionList = questions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q._id}`] = q.userAnswer || "";
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      return audioPlayerRef.current?.reset();
    },
  }));

  // const validationSchema = Yup.object().shape(
  //   questionList.reduce((schema, q) => {
  //     return {
  //       ...schema,
  //       [`question_${q._id}`]: Yup.string().required("Please select an answer"),
  //     };
  //   }, {})
  // );

  const handleBack = async () => {
    // ✅ FIX: Reset audio player trước khi back
    await audioPlayerRef.current?.reset();

    if (onBack) onBack();
    else navigation.goBack();
  };

  const onFormSubmit = async (values: Record<string, string>) => {
    // ✅ FIX: Reset audio player trước khi submit
    await audioPlayerRef.current?.reset();

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
      // validationSchema={validationSchema}
      onSubmit={async (values) => {
        if (audioPlayerRef.current) {
          await audioPlayerRef.current.reset();
        }
        onFormSubmit(values);
      }}
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

        const goToNextQuestion = async () => {
          if (currentQuestionIndex < questionList.length - 1) {
            if (audioPlayerRef.current) {
              await audioPlayerRef.current.reset();
            }
            setCurrentQuestionIndex(currentQuestionIndex + 1);
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
            isViewMode={isViewMode}
            isHiddenSubmit={isHiddenSubmit}
            toggleExplanation={toggleExplanation}
          />
        );
      }}
    </Formik>
  );
};

export default forwardRef(PracticeType1);
