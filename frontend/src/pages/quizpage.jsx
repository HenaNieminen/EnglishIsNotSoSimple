import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/datacontext';
import Quiz from '../components/quiz';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box, Button } from '@mui/material';

const QuizPage = () => {
    //Take language context from Datacontext
    const { langs } = useContext(DataContext);
    //User selectable values
    const [selectedLang, setSelectedLang] = useState('');
    const [quizLength, setQuizLength] = useState('');
    //This will handle the status of the quiz and allows exit out of it once done
    const [startQuiz, setStartQuiz] = useState(false);
    //Handle the language value
    const handleLangChange = (e) => {
        setSelectedLang(e.target.value);
    };
    //User can set the quiz length between 1 and 10
    const handleLengthChange = (e) => {
        const changeValue = e.target.value;
        if (changeValue === '' || (changeValue) >= 1 && changeValue <= 10) {
            setQuizLength(changeValue);
        }
    };
    /*The use of material UI syntax was assisted with co-pilot. These may not be final
    once I get more familiar with it*/
    return (
        <div className="mainContainer">
            {/*When quiz is not active, show all elements to manipulate the quiz for the user */}
            {!startQuiz &&
                <>
                    <Link className="navButton" to="/">Go back</Link>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        minWidth: 400,
                        maxWidth: 500,
                        margin: 'auto',
                        padding: 5,
                        backgroundColor: 'lightgray'
                    }}>
                        <FormControl fullWidth>
                            <InputLabel id="language-select-label" sx={{ marginBottom: 20 }}>Quiz language</InputLabel>
                            <Select
                                labelId="language-select-label"
                                value={selectedLang}
                                onChange={handleLangChange}
                                label="Quiz language"
                                sx={{ minWidth: 400, maxWidth: 500, backgroundColor: 'white' }}
                            >
                            {langs.map((lang) => (
                                <MenuItem key={lang.id} value={lang.id}>
                                    {lang.language}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Quiz Length"
                            type="number"
                            value={quizLength || ""}
                            onChange={handleLengthChange}
                            fullWidth
                            sx={{ minWidth: 400, maxWidth: 500, backgroundColor: 'white' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setStartQuiz(true)}
                            disabled={!quizLength ||!selectedLang}
                        >
                        {/*Stops the user from moving on if both values are missing */}
                            Start Quiz
                        </Button>
                    </Box>
                </>
            }
            {/*When user starts the quiz, pass all the props and the active status */}
            {startQuiz && <Quiz language={selectedLang} length={quizLength} active={setStartQuiz} />}
        </div>
    );
};

export default QuizPage;
