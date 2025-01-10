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
    const [tempTranslations, setTempTranslations] = useState([]);

    const adjustWord = async (id, lang_id, word) => {
        const updatedWord = [ id, lang_id, word ];
        try {
            patchWords(updatedWord);
        } catch (error) {
            console.error("Updating word failed:", error);
        }
    };

    const seekTrans = async (id) => {
        try {
            const trans = await fetchTransForWordId(id);
            const transIds = trans.map(t => t.trans_id);
            //Map out all words it translates to
            const transWords = transIds
                .map((transId) => words.find((word) => word.id === transId))
                .map((word) => word.word);
            return transWords;
        } catch (error) {
            console.error("Error fetching trans", error);
            return [];
        }
    };

    const handleEdit = async (word) => {
        setEditMode(word.id);
        const translations = await seekTrans(word.id); //Fetch translations for the word
        setTempTranslations(translations);
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
                {words.map((word, index) => {
                    return editMode === word.id ? (
                        <>
                            <Box sx={{ display: 'flex', gap: 5, flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between'}}>
                                <Typography key={index}>
                                    {word.word}
                                </Typography>
                            </Box>
                        </>
                        ) : (
                        <>
                            <Box sx={{display: 'flex', gap: 5, flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between'}}>
                                <Typography key={index}>
                                    {word.word}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleEdit(word)}
                                    sx={{}}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </>
                    )
                })}
            </Box>
        </>
    );
};

export default Editor;

