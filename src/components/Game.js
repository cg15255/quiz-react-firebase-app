import React, { useState, useEffect, useCallback } from 'react'
import Question from './Question'
import { loadQuestions } from '../helpers/QuestionsHelper'
import HUD from '../components/HUD'
import SaveScoreForm from '../components/SaveScoreForm'
import CategoryChooser from './CategoryChooser'

// TODO: Add extra bonus in score for time
// TODO: Add option for user to select the category
// TODO: If user does not score in the top 10, do not allow them to save their high score
// TODO: Add a Play again Button on the High Score page and clean up the styling on this page
// TODO: Have different high score leaderboards for different quiz categories

export default function Game({ history }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [done, setDone] = useState(false)
  const [categoryChoice, setCategoryChoice] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    // load the questions when the player chooses the category
    loadQuestions(10, categoryChoice, 'medium', 'multiple')
      .then(setQuestions)
      .catch(console.error)
  }, [categoryChoice])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(
        () => setElapsedTime(prevElapsedTime => prevElapsedTime + 0.1),
        100
      )
    }
    return () => clearInterval(interval)
  }, [isRunning, currentQuestion])

  const scoreSaved = () => {
    history.push('/')
  }

  const changeQuestion = useCallback(
    (bonus = 0) => {
      // get current elapsed time and calculate a score modifier
      let scoreTimeModifier = 10 - elapsedTime
      // don't let the score Modifier go less than 1
      if (scoreTimeModifier < 1) scoreTimeModifier = 1
      // reset the elapsed time to zero for the useTimer hook to retrigger and start again
      setElapsedTime(0)
      if (questions.length === 0) {
        setDone(true)
        setIsRunning(false)
        return setScore(score + bonus * scoreTimeModifier)
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
      setScore(score + bonus * scoreTimeModifier)
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
      elapsedTime,
      setElapsedTime,
      setIsRunning,
    ]
  )
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    console.log('hey there')
    if (!currentQuestion && questions.length) {
      changeQuestion()
      setIsRunning(true)
    }
  }, [currentQuestion, questions.length])
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      {loading && !done && categoryChoice && <div id='loader' />}

      {!categoryChoice && (
        <CategoryChooser setChoice={choice => setCategoryChoice(choice)} />
      )}

      {!done && !loading && currentQuestion && categoryChoice && (
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
