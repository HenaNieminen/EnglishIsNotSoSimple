import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import { postWords } from '../context/backendfunc'
import { TextField, Typography, Button, Box } from '@mui/material/';

const Adder = () => {
    const { langs, words, syncData } = useContext(DataContext);
    const [ postedWord, setPostedWord ] = useState('');
    const [ postedLang, setPostedLang ] = useState(0);

    const sendWord = async (lang_id, word) => {
        try {
            const postedWord = { lang_id, word };
            postWords(postedWord);
        } catch (error) {
            console.error('Error posting word', error);
        };
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 400,
            maxWidth: 900,
            maxHeight: 200,
            margin: 'auto',
            backgroundColor: '#525252',
            padding: 5
        }}>
            <TextField
                variant="outlined"
                value={postedWord}
                onChange={(e) => setPostedWord(e.target.value)}
                sx={{ backgroundColor: "white", marginBottom: 2 }}
            />
            <Button
                variant="contained"
                onClick={async () => {
                    sendWord(postedLang, postedWord);
                }}
                sx={{ marginTop: 3 }}
            >
                Save
            </Button>
        </Box>
    );
}

export default Adder;
