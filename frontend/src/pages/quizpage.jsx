import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import Quiz from '../components/quiz';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';

const QuizPage = () => {
    //Take language context from Datacontext
    const { langs } = useContext(DataContext);
    //User selectable values
    const [selectedLang, setSelectedLang] = useState('');
    const [quizLength, setQuizLength] = useState(1);

    const handleLangChange = (e) => {
        setSelectedLang(e.target.value);
    };

    const handleLengthChange = (e) => {
        setQuizLength(Math.min(10, Math.max(1, e.target.value)));
    };
    /*The use of material UI syntax was assisted with co-pilot. These may not be final
    once I get more familiar with it*/
    return (
        <div className="mainContainer">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minWidth: 400,
                maxWidth: 500,
                margin: 'auto',
                backgroundColor: 'white'
            }}>
                <FormControl fullWidth>
                    <InputLabel id="language-select-label">Select Language</InputLabel>
                    <Select
                        labelId="language-select-label"
                        value={selectedLang}
                        onChange={handleLangChange}
                        label="Select Language"
                        sx={{ minWidth: 400, maxWidth: 500 }}
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
                    value={quizLength}
                    onChange={handleLengthChange}
                    inputProps={{ min: 1, max: 10 }}
                    fullWidth
                    sx={{ minWidth: 400, maxWidth: 500 }}
                />
                <Quiz langId={selectedLang} length={quizLength} />
            </Box>
        </div>
    );
};

export default QuizPage;
