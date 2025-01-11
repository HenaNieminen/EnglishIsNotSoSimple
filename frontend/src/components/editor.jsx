import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import {
    deleteWords,
    deleteTrans,
    postTrans,
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
        const updatedWord = { id, lang_id, word };
        try {
            await patchWords(updatedWord);
            await syncData();
        } catch (error) {
            console.error("Updating word failed:", error);
        };
    };

    const seekTrans = async (id) => {
        try {
            let trans = await fetchTransForWordId(id);
            if (trans === null) {
            return [];
            };
            const transIds = trans.map(t => t.trans_id);
            // Map out all words it translates to along with their ids
            const transWords = transIds
                .map((transId) => words.find((word) => word.id === transId))
                .map((word) => ({ id: word.id, word: word.word }));
            return transWords;
        } catch (error) {
            console.error("Error fetching trans", error);
            return [];
        };
    };

    const handleEdit = async (word) => {
        setEditMode(word.id);
        const translations = await seekTrans(word.id); //Fetch translations for the word
        setTempTranslations(translations);
    };

    const handleDelete = async (id) => {
        try {
            await deleteWords(id);
            setEditMode(null);
            await syncData();
        } catch (error) {
            console.error("Deleting word failed:", error);
        };
    }

    const handleAddTranslation = async (wordId, transId) => {
        try {
            await postTrans({ word_id: wordId, trans_id: transId });
            const updatedTranslations = await seekTrans(wordId);
            setTempTranslations(updatedTranslations);
            await syncData();
        } catch (error) {
            console.error("Adding translation failed:", error);
        };
    };

    const handleDeleteTranslation = async (wordId, transId) => {
        try {
            await deleteTrans({ word_id: wordId, trans_id: transId });
            const updatedTranslations = await seekTrans(wordId);
            setTempTranslations(updatedTranslations);
            await syncData();
        } catch (error) {
            console.error("Deleting translation failed:", error);
        };
    };

    return (
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
            {words.map((word) => {
                return editMode === word.id ? (
                    <Box key={word.id} sx={{ marginBottom: 5 }}>
                        <TextField
                            variant="outlined"
                            value={editedWord}
                            onChange={(e) => setEditedWord(e.target.value)}
                            sx={{ backgroundColor: "white", marginBottom: 2 }}
                        />
                        <Typography>
                            Translations: {tempTranslations.map((tran) => tran.word).join(', ')}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                adjustWord(word.id, word.lang_id, editedWord);
                                setEditMode(null);
                            }}
                            sx={{ marginTop: 3 }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setEditMode(null)}
                            sx={{ marginTop: 3, marginLeft: 2 }}
                        >
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <Box
                        key={word.id}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 5,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(word.id)}
                            sx={{ marginLeft: 2 }}
                        >
                            Delete
                        </Button>
                        <Typography sx={{ color: "white" }}>{word.word}</Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setEditedWord(word.word);
                                handleEdit(word);
                            }}
                        >
                            Edit
                        </Button>
                    </Box>
                );
            })}
        </Box>
    );
};

export default Editor;

