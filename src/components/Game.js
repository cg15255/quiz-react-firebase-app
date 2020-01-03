import React, { useState, useEffect, useCallback } from 'react'
import Question from './Question'
import { loadQuestions } from '../helpers/QuestionsHelper'
import HUD from '../components/HUD'
import SaveScoreForm from '../components/SaveScoreForm'

export default function Game({ history }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    loadQuestions()
      .then(setQuestions)
      .catch(console.error)
  }, [])

  const scoreSaved = () => {
    history.push('/')
  }

  const changeQuestion = useCallback(
    (bonus = 0) => {
      if (questions.length === 0) {
        setDone(true)
        return setScore(score + bonus)
      }
      // get a random index of a question
      const randomQuestionIndex = Math.floor(Math.random() * questions.length)
      // set current question to the question at that random index
      const currentQuestion = questions[randomQuestionIndex]
      // remove that question from the questions going forward
      const remainingQuestions = [...questions].filter(
        question => question !== currentQuestion
      )

      // update the state to reflect these changes
      setQuestions(remainingQuestions)
      setCurrentQuestion(currentQuestion)
      setLoading(false)
      setScore(score + bonus)
      setQuestionNumber(questionNumber + 1)
    },
    [
      score,
      questionNumber,
      questions,
      setQuestions,
      setLoading,
      setCurrentQuestion,
      setQuestionNumber,
    ]
  )

  useEffect(() => {
    if (!currentQuestion && questions.length) {
      changeQuestion()
    }
  }, [currentQuestion, questions, changeQuestion])

  return (
    <>
      {loading && !done && <div id='loader' />}

      {!done && !loading && currentQuestion && (
        <>
          <HUD questionNumber={questionNumber} score={score} />
          <Question
            question={currentQuestion}
            changeQuestion={changeQuestion}
          />
        </>
      )}
      {done && <SaveScoreForm score={score} scoreSaved={scoreSaved} />}
    </>
  )
}
