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
    const [ editMode, setEditMode ] = useState(null);

    const adjustWord = async (id, lang_id, word) => {
        const updatedWord = [ id, lang_id, word ];
        try {
            patchWords(updatedWord);
        } catch (error) {
            console.error("Updating word failed:", error);
        }
    };

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 400,
                maxWidth: 900,
                maxHeight: 1000,
                margin: 'auto',
                backgroundColor: '#525252',
                padding: 5,
                overflowY: 'scroll'
            }}>
                {words.map((word, index) => (
                    editMode === word.id ? (
                        <>
                        <Typography key={index}>
                            {word.word}
                        </Typography>
                        </>
                    ) : (
                        <>
                            <Typography>
                                {word.word}
                            </Typography>
                            <Button onClick={() => setEditMode(word.id)}>
                                Edit
                            </Button>
                        </>
                    )
                ))}
            </Box>
        </>
    );
};

export default Editor;

