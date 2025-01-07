import { useState, useEffect, useContext } from 'react';
import { fetchTransForWordId } from '../context/backendfunc';
import { DataContext } from '../context/datacontext';

const Quiz = ({ language, length, active }) => {
    const { words } = useContext(DataContext);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [quizOver, setQuizOver] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    useEffect(() => {
        const generateQuestions = async () => {
            const langWords = words.filter(word => word.lang_id === language);
            //Exit if words are not available
            if (langWords.length === 0) {
                console.warn('No words available for the selected language.');
                return;
            };
            const tempArray = [];
            /*This new technique of using sets was suggested by co-pilot. Pretty good for
            weeding out anomalies and duplicates*/
            const usedWordIds = new Set();
            //Maxlength will make questions as much as possible if user picks more than there are words
            const maxLength = Math.min(length, langWords.length);

            while (tempArray.length < maxLength) {
                const randomIndex = Math.floor(Math.random() * langWords.length);
                const randomWord = langWords[randomIndex];
                //Skip if a randomly selected word is already there in the Set
                if (usedWordIds.has(randomWord.id)) {
                    continue;
                };
                try {
                    const translations = await fetchTransForWordId(randomWord.id);
                    const transIds = translations.map(trans => trans.trans_id);
                    const answers = words.filter(word => transIds.includes(word.id));

                    if (answers.length > 0) {
                        tempArray.push({
                            question: randomWord.word,
                            answers: answers.map(answer => answer.word),
                        });
                        usedWordIds.add(randomWord.id);//Add used word to the Set
                    };
                } catch (error) {
                    console.error(`Error fetching translations for word ID ${randomWord.id}:`, error);
                };
            }
            setQuestions(tempArray);
        };
        generateQuestions();},
        [language, length, words]);

    const handleSubmit = () => {
        //Handle the submitted answers
        let tempScore = 0;

        questions.forEach((q, index) => {
            const userAnswer = userAnswers[index].toLowerCase();
            const correctAnswers = q.answers.map(answer => answer.toLowerCase());

            //Check if the user's answer matches any correct answer
            if (userAnswer && correctAnswers.includes(userAnswer)) {
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
        <div>
            {questions.map((q, index) => (
                <div key={index}>
                    <h3>Question: {q.question}</h3>
                    <input
                        type="text"
                        value={userAnswers[index] || ''}
                        onChange={(e) => handleInputChange(e, index)}
                        disabled={quizOver}
                    />
                    {quizOver && (
                        <div>
                            <p>Correct Answer: {q.answers}</p>
                            <p>Your Answer: {userAnswers[index]}</p>
                        </div>
                    )}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                disabled={quizOver}>
                Submit
            </button>
            {quizOver && (
                <div>
                    <h2>Your Score: {score} / {questions.length}</h2>
                    {/*Return the quizpage back to normal state */}
                    <button onClick={() => active(false)}>
                        Exit
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
