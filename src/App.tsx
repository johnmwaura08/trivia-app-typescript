import React, { useState } from 'react';
import { Difficulty, fetchQuizQuestions, QuestionState } from './API';
import { GlobalStyle, Wrapper } from './App.styles';
import QuestionCard from './components/QuestionCard';
export type AnswerObject = {
	question: string,
	answer: string,
	correct: boolean,
	correctAnswer: string,
}


function App() {
	const [ questionAmount, setQuestionAmount] = useState(10)
	const [ level, setLevel] = useState<Difficulty>(Difficulty.EASY)
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionState[]>([]);
	const [number, setNumber] = useState(0)
	const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true)
	const [inputSelected, setInputSelected] = useState(false)
	const TOTAL_QUESTIONS = questionAmount;

	// console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY))

	const handleStartTrivia = async () => {
		setLoading(true);
		setGameOver(false);

		const newQuestions = await fetchQuizQuestions(questionAmount,level)
		setQuestions(newQuestions)
		setScore(0)
		setUserAnswers([])
		setNumber(0)
		setLoading(false)

	}

	const handleCheckAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
		if(!gameOver) {
			const answer = e.currentTarget.value;

			const correct = questions[number].correct_answer === answer;

			if(correct) setScore(prev => prev + 1)
			
			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer

			};

			setUserAnswers( prev => [...prev, answerObject])
		}

	}

	const handleNextQuestion = () => {
		const nextQuestion = number + 1;
		if(nextQuestion === TOTAL_QUESTIONS){
			setGameOver(true)
		}
		else {
			setNumber(nextQuestion)
		}

	}

	const handleSubmit = () => {
		// event.preventDefault()
		setInputSelected(true)
	}


	return (
	<>
	<GlobalStyle />
		<Wrapper>
			<h1>React Quiz</h1>
				<form >
					<label>
						How many Questions would you like? 
          			<input type="text" value={questionAmount} onChange={(e: React.FormEvent<HTMLInputElement>) => setQuestionAmount(e.target.value)} />
					</label>
					<label>
						Select Difficulty:
					  <select value={level} onChange={(e: React.FormEvent<HTMLSelectElement>) => setLevel(e.target.value)}>
							<option value="EASY">Easy</option>
							<option value="MEDIUM">Medium</option>
							<option value="HARD">Hard</option>
						</select>
					</label>
					<input type="submit" value="Submit" onClick={(e: React.FormEvent<HTMLInputElement>) => {e.preventDefault(); handleSubmit()}}/>
				</form>

			
			{
				inputSelected ?  
				
				gameOver || userAnswers.length === TOTAL_QUESTIONS  ? (
					<button className="start" onClick={handleStartTrivia}>Start</button>
					) : null
					: null
			}
			{
				!gameOver ? (
					<p className="score">Score:{score}</p>
				) : null
			}
			{
				loading ? (
					<p>Loading...</p>
				) : null
			}
			{
				!loading && !gameOver ? (

					<QuestionCard
						questionNumber={number + 1}
						totalQuestions={TOTAL_QUESTIONS}
						question={questions[number].question}
						answers={questions[number].answers}
						userAnswer={userAnswers ? userAnswers[number] : undefined}
						callback={handleCheckAnswer}
					/>
				) : null
			}
			{
				!gameOver && !loading && userAnswers.length === number + 1 && number!== TOTAL_QUESTIONS ? (

					<button className="next" onClick={handleNextQuestion}>Next Question</button>
				) : null
			}


		</Wrapper>
		</>
	);
}

export default App;
