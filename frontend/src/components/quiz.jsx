import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/datacontext';
import { fetchTransForWordId } from '../context/backendfunc';
import PropTypes from 'prop-types'
import { TextField, Typography, Button, Box } from '@mui/material/';

const Quiz = ({ language, length, active }) => {
    const { words, trans } = useContext(DataContext);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [quizOver, setQuizOver] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);


    useEffect(() => {
        const generateQuestions = async () => {
            const langWords = words.filter(word => word.lang_id === language);
            const wordsWithTran = langWords.filter(word => trans.some(tran => tran.word_id === word.id));
            if (wordsWithTran.length === 0) {
                console.warn('No translations available for the selected words.');
                active(false);
                return;
            }

            const tempArray = [];
            /*This new technique of using sets was suggested by co-pilot. Pretty good for
            weeding out anomalies and duplicates*/
            const usedWordIds = new Set();
            //Will set the length as long as possible if there are not enough words than user requested
            if (wordsWithTran.length < length) {
                length = wordsWithTran.length;
            }

            while (tempArray.length < length) {
                const randomIndex = Math.floor(Math.random() * length);
                const randomWord = wordsWithTran[randomIndex];
                //Skip if a randomly selected word is already there in the Set
                if (usedWordIds.has(randomWord.id)) {
                    continue;
                };
                try {
                    const translations = await fetchTransForWordId(randomWord.id);
                    const transIds = translations.map(trans => trans.trans_id);
                    const answers = words.filter(word => transIds.includes(word.id));
                    tempArray.push({
                        question: randomWord.word,
                        answers: answers.map(answer => answer.word),
                    });
                    usedWordIds.add(randomWord.id);//Add used word to the Set
                } catch (error) {
                    console.error(`Error fetching translations for word ID ${randomWord.id}:`, error);
                }
            }
            setQuestions(tempArray);
        };
        if (!quizOver) {
            generateQuestions();
        }
    }, [language, length, words, trans, active, quizOver]);

    const handleSubmit = () => {
        //Handle the submitted answers
        let tempScore = 0;

        questions.forEach((q, index) => {
            const userAnswer = userAnswers[index]?.toLowerCase() || "";
            const correctAnswers = q.answers.map(answer => answer.toLowerCase());
            //Check if the user's answer matches any correct answer
            if (correctAnswers.includes(userAnswer)) {
                tempScore += 1;
            }
        });
        //Set the final score and end the quiz
        setScore(tempScore);
        setQuizOver(true);
    };

    const handleInputChange = (e, index) => {
        //Handle user typing in their answer, taking the event target value
        const { value } = e.target;
        setUserAnswers({
            ...userAnswers,
            [index]: value,
        });
    };

    return (
        <>
            <Box style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 400,
                maxWidth: 500,
                margin: 'auto',
                padding: 5,
                backgroundColor: '#525252'
            }}>
                {!questions.length && (
                    <Typography>Loading...</Typography>
                )}
                {questions.map((q, index) => (
                    <div key={index}>
                        <h3>Translate: {q.question}</h3>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={userAnswers[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            disabled={quizOver}
                            margin="normal"
                            style={{
                                backgroundColor: "white",
                            }}
                        />
                        {quizOver && (
                            <div>
                                <Typography > Correct answer: {q.answers.join(', ')}</Typography>
                                <Typography > Your answer: {userAnswers[index]}</Typography>
                                {/*Show the answers after the quiz*/}
                            </div>
                        )}
                    </div>
                ))}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={quizOver || questions.length === 0}
                    style={{ marginTop: '20px', justifyItems: "center" }}
                >
                    Submit
                </Button>
                {/*Submit the quiz and give out the score*/}
                {quizOver && (
                    <div>
                        <Typography variant="h5" sx={{ marginTop: '20px', color:"white" }}>
                            Your score: {score} / {questions.length}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => active(false)}
                            style={{ marginTop: '10px' }}
                        >
                            Exit
                        </Button>
                        {/*Return back to quiz page */}
                    </div>
                )}
            </Box>
        </>
    );
};

Quiz.propTypes = {
    language: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    active: PropTypes.func.isRequired
}

export default Quiz;
