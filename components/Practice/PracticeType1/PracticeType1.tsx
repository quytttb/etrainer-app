import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import QuestionRenderer from "./QuestionRenderer";

interface IAnswer {
  answer: string;
  isCorrect: boolean;
  _id: string;
}

interface Question {
  _id: string;
  audio: {
    name: string;
    url: string;
  };
  type: string;
  question: string | null;
  imageUrl: string;
  answers: IAnswer[];
  questions: string | null;
  createdAt: string;
  updatedAt: string;
  questionNumber: number;
  __v: number;
}

interface PracticeType1Props {
  questions: Question[];
  onBack?: () => void;
  onSubmit?: (values: Record<string, string>) => void;
}

const PracticeType1 = ({ questions, onBack, onSubmit }: PracticeType1Props) => {
  const questionList = questions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q._id}`] = "";
  });

  // Optional: Create validation schema
  const validationSchema = Yup.object().shape(
    questionList.reduce((schema, q) => {
      return {
        ...schema,
        [`question_${q._id}`]: Yup.string().required("Please select an answer"),
      };
    }, {})
  );

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (onSubmit) onSubmit(values);
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
        const currentQuestion = questionList[currentQuestionIndex];

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
          />
        );
      }}
    </Formik>
  );
};

export default PracticeType1;
