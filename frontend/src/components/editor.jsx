import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import {
    deleteWords,
    deleteTrans,
    patchWords,
    fetchTransForWordId,
} from '../context/backendfunc';
import { TextField, Typography, Button, Box } from '@mui/material/';
//I am become import, the destroyer of coherency

const Editor = () => {
    const { langs, words, trans, syncData } = useContext(DataContext);
    const [ editedWord, setEditedWord ] = useState('');

    const adjustWord = async (id, lang_id, word) => {
        const updatedWord = { id, lang_id, word };
        try {
            patchWords(updatedWord);
        } catch (error) {
            console.error("Updating word failed:", error);
        }
    };

    return (
        <>
            <Box style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 400,
                maxWidth: 700,
                margin: 'auto',
                backgroundColor: 'white'
            }}>
                {words.map((word, index) => {
                    return (
                        <Typography key={index}>
                            {word}
                        </Typography>
                    );
                })}
            </Box>
        </>
    );
};

export default Editor;