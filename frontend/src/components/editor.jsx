import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import { toast } from 'react-toastify';
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
        //Structure the updated word into an object
        const updatedWord = { id, lang_id, word };
        try {
            //Send it over and sync the data again
            await patchWords(updatedWord);
            await syncData();
        } catch (error) {
            console.error("Updating word failed:", error);
            if (error.response.status === 409) {
                toast.error("Updating word failed: word already exists.");
            } else {
                toast.error("Updating word failed:", error);
            }
        };
    };

    const seekTrans = async (id) => {
        try {
            //Fetch the translations for the word
            let trans = await fetchTransForWordId(id);
            if (trans === null) {
                return [];
            };
            //Map the transIDs for the word
            const transIds = trans.map(t => t.trans_id);
            //Find all the words from the words datacontext and then map them
            const transWords = transIds
                .map((transId) => words.find((word) => word.id === transId))
                .map((word) => ({ id: word.id, word: word.word }));
            //Return the transwords as an array clump
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
            //Delete the word
            await deleteWords(id);
            //Exit the edit mode
            setEditMode(null);
            //Sync the data from context
            await syncData();
        } catch (error) {
            console.error("Deleting word failed:", error);
        };
    }

    const handleAddTranslation = async (wordId, transId) => {
        try {
            //Post the translation
            await postTrans(wordId, transId);
            //Seek the translations again for that word
            const updatedTranslations = await seekTrans(wordId);
            //Set the new translations
            setTempTranslations(updatedTranslations);
            //Sync data overall again
            await syncData();
        } catch (error) {
            console.error("Adding translation failed:", error);
        };
    };

    const handleDeleteTranslation = async (wordId, transId) => {
        try {
            console.log(wordId);
            console.log(transId);
            //Delete the trans
            await deleteTrans(wordId, transId);
            //Seek trans for that word
            const updatedTranslations = await seekTrans(wordId);
            //Set it
            setTempTranslations(updatedTranslations);
            //Sync
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
            {/*If empty*/}
            {words.length === 0 ? (
                <Typography variant="h4" sx={{ color: "white", textAlign: "center" }}>Database is empty</Typography>
            ) : (
                words.map((word) => {
                    {/*Edit mode view*/ }
                    return editMode === word.id ? (
                        <Box key={word.id} sx={{ marginBottom: 5 }}>
                            <TextField
                                variant="outlined"
                                value={editedWord}
                                onChange={(e) => setEditedWord(e.target.value)}
                                sx={{ backgroundColor: "white", marginBottom: 2 }}
                            />
                            {tempTranslations.map((tran) => (
                                <Button
                                    key={tran.id}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDeleteTranslation(word.id, tran.id)}
                                    sx={{ marginBottom: 1 }}
                                >
                                    {tran.word}
                                </Button>
                            ))}
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
                        {/*Normal view*/}
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
                })
            )}
        </Box>
    );
};

export default Editor;