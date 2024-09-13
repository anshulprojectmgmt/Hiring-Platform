import React from 'react'
import { useSelector } from 'react-redux';
import Body from '../body/Body';
import Subjective from '../subjective/Subjective';

const TestTypeWrapper = () => {
     const questions = useSelector((state) => state.getQuestion.questions);
    const currentQuestion = useSelector((state) => state.getQuestion.currentQuestion);
  return (
    <div>{
        questions[currentQuestion].type === "coding" ? <Body /> : <Subjective />
        }
        </div>
  )
}

export default TestTypeWrapper