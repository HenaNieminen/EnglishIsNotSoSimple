import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/datacontext';
import { toast } from 'react-toastify'
import { fetchTransForWordId } from '../context/backendfunc';
import PropTypes from 'prop-types';
import { TextField, Typography, Button, Box } from '@mui/material/';

const Quiz = ({ language, length, active, activeStatus }) => {
    //Context from DataContext
    const { words, trans } = useContext(DataContext);
    //SetStates for quiz
    const [ questions, setQuestions ] = useState([]);
    const [ score, setScore ] = useState(0);
    const [ quizOver, setQuizOver ] = useState(false);
    const [ userAnswers, setUserAnswers ] = useState([]);

    useEffect(() => {
        //Take the user given length of the quiz to a new variable
        let quizLength = length;
        const generateQuestions = async () => {
            //Select the words from the language user wants to quiz
            const langWords = words.filter(word => word.lang_id === language);
            //Filter out words that have translations available
            const wordsWithTran = langWords.filter(word => trans.some(tran => tran.word_id === word.id));
            //If the language of the words has no translations, cut it shut
            if (wordsWithTran.length === 0) {
                toast.error('No translations available for the selected language of words.');
                active(false);
                return;
            };
            //Temp array to fill words
            const tempArray = [];
            /*This technique of using sets was suggested by co-pilot. Pretty good for
            weeding out anomalies and duplicates*/
            const usedWordIds = new Set();
            //Will set the length as long as possible if there are not enough words than user requested
            if (wordsWithTran.length < quizLength) {
                quizLength = wordsWithTran.length;
            };

            while (tempArray.length < length) {
                //Pick a random word
                const randomIndex = Math.floor(Math.random() * wordsWithTran.length);
                const randomWord = wordsWithTran[randomIndex];
                //Skip if a randomly selected word is already there in the Set
                if (usedWordIds.has(randomWord.id)) {
                    continue;
                };
                try {
                    //Use the fetchTransForWordId method to fetch all translations
                    const translations = await fetchTransForWordId(randomWord.id);
                    const transIds = translations.map(trans => trans.trans_id);
                    //Filter the answers from the words state
                    const answers = words.filter(word => transIds.includes(word.id));
                    //Push question into the temp array
                    tempArray.push({
                        question: randomWord.word,
                        answers: answers.map(answer => answer.word),
                    });
                    usedWordIds.add(randomWord.id);
                    //Add used word to the Set
                } catch (error) {
                    toast.error(`Error generating questions. Error status: ${error.response.status}`);
                    active(false);
                    return;
                };
            };
            //Set questions from the tempArray
            setQuestions(tempArray);
        };
        //When quiz becomes active, generate the questions
        if (activeStatus === true && !quizOver) {
            generateQuestions();
        };
    }, [language, length, words, trans, active, quizOver, activeStatus]);

    const handleSubmit = () => {
        //Handle the submitted answers
        let tempScore = 0;

        //Go through each question
        questions.forEach((q, index) => {
            //Take the user answer from the index or defaut it to an empty string and then make it lowercase
            const userAnswer = (userAnswers[index] || "").toLowerCase();
            //Map the correct answers from the question and convert them to lowercase
            const correctAnswers = q.answers.map(answer => answer.toLowerCase());
            //Check if the user's answer matches any correct answer
            if (correctAnswers.includes(userAnswer)) {
                tempScore += 1;
            };
        });
        //Set the final score and end the quiz
        setScore(tempScore);
        setQuizOver(true);
    };

    const handleInputChange = (e, index) => {
        /*Take the useranswers to a new const, update the answers
        at the index with the event target value and set the new tempanswers */
        const tempAnswers = [...userAnswers];
        tempAnswers[index] = e.target.value;
        setUserAnswers(tempAnswers);
    };

    return (
        <>
            <Box style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 400,
                maxWidth: 700,
                margin: 'auto',
                padding: 5,
                backgroundColor: '#525252'
            }}>
                {!questions.length && (
                    <>
                    <Typography>Loading...</Typography>
                    <Box>
                        <Typography>If it doesn&apos;t load, exit here</Typography>
                        <Button onClick={() => active(false)} variant="contained">
                            Escape
                        </Button>
                    </Box>
                    </>
                )}
                {/*Display this when questions haven't loaded in yet*/}
                {questions.map((q, index) => (
                    <div key={index}>
                        <h3>Translate: {q.question}</h3>
                        <TextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={userAnswers[index] || ""}
                            onChange={(e) => handleInputChange(e, index)}
                            disabled={quizOver}
                            margin="normal"
                            sx={{
                                backgroundColor: "white",
                                size: "small",
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
                            onClick={() => { active(false); setQuizOver(false); }}
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

//Proptype validation
Quiz.propTypes = {
    language: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    active: PropTypes.func.isRequired,
    activeStatus: PropTypes.bool.isRequired
};

export default Quiz;
