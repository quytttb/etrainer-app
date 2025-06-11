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
import AudioManager from "@/app/journeyNew/utils/AudioManager";

interface PracticeType3Props {
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

const PracticeType3 = (
  {
    questions,
    onBack,
    onSubmit,
    isViewMode,
    questionId,
    toggleExplanation,
  }: PracticeType3Props,
  ref: any
) => {
  const questionList = questions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    if (q.questions && q.questions.length > 0) {
      // Handle nested questions
      q.questions.forEach((subQ) => {
        initialValues[`question_${q._id}_${subQ._id}`] = subQ.userAnswer || "";
      });
    } else {
      // Handle direct answers
      initialValues[`question_${q._id}`] = q.userAnswer || "";
    }
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
    if (audioPlayerRef.current) {
      await audioPlayerRef.current.reset();
    }

    if (onBack) onBack();
    else navigation.goBack();
  };

  const onFormSubmit = async (values: Record<string, string>) => {
    // ✅ FIX: Reset audio player trước khi submit
    await audioPlayerRef.current?.reset();

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
            // ✅ FIX: Pause all audio khi chuyển câu hỏi theo đề xuất của user
            try {
              await AudioManager.pauseAllAudio();
              console.log('🎵 Audio paused when going to next question in Practice');
            } catch (error) {
              console.error('❌ Error pausing audio:', error);
            }

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
            // ✅ FIX: Pause all audio khi chuyển câu hỏi theo đề xuất của user
            try {
              await AudioManager.pauseAllAudio();
              console.log('🎵 Audio paused when going to previous question in Practice');
            } catch (error) {
              console.error('❌ Error pausing audio:', error);
            }

            if (audioPlayerRef.current) {
              await audioPlayerRef.current.reset();
            }
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

export default forwardRef(PracticeType3);
