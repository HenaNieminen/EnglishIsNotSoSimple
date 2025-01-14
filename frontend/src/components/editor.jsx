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
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Button,
    Box
} from '@mui/material/';

const Editor = () => {
    const { langs, words, syncData } = useContext(DataContext);
    const [ editedWord, setEditedWord ] = useState('');
    const [ editLang, setEditLang ] = useState('');
    const [ editMode, setEditMode ] = useState(null);
    const [ tempTranslations, setTempTranslations ] = useState([]);

    const adjustWord = async (id, lang_id, word) => {
        //Structure the updated word into an object
        const updatedWord = { id, lang_id, word };
        try {
            //Send it over and sync the data again
            await patchWords(updatedWord);
            await syncData();
        } catch (error) {
            //Error handling. Conflicts will have their unique toast notification
            if (error.status === 409) {
                toast.error("Updating word failed: word already exists.");
                return
            };
            toast.error("Updating word failed:", error);
            console.error("Updating word failed:", error);
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
            //Handle errors and return an empty array
            console.error("Error fetching trans", error);
            return [];
        };
    };

    const handleEdit = async (word) => {
        //Handle edits. Set the edit mode to the particular word and seek all translations for it
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
            //Error handling
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 400,
                maxWidth: 900,
                maxHeight: 700,
                margin: 'auto',
                backgroundColor: '#525252',
                padding: 5,
                overflowY: 'scroll',
            }}
        >
            {/*If the database is empty */}
            {words.length === 0 ? (
                <Typography variant='h4' sx={{ color: 'white', textAlign: 'center' }}>
                    Database is empty
                </Typography>
            ) : (
                words.map((word) => {
                    {/*Edit mode view*/ }
                    return editMode === word.id ? (
                        <Box
                            key={word.id}
                            sx={{
                                marginBottom: 5,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box sx={{ backgroundColor: 'white', marginBottom: 1 }}>
                                <FormControl sx={{ marginTop: 1, width: '100%' }}>
                                    <InputLabel id='language-select-label'>Language</InputLabel>
                                    <Select
                                        labelId='language-select-label'
                                        value={editLang}
                                        size='small'
                                        onChange={(e) => setEditLang(e.target.value)}
                                        label='Language'
                                        sx={{ backgroundColor: 'white' }}
                                    >
                                        {langs.map((lang) => (
                                            <MenuItem key={lang.id} value={lang.id}>
                                                {lang.language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    variant="outlined"
                                    value={editedWord}
                                    size="small"
                                    onChange={(e) => setEditedWord(e.target.value)}
                                    sx={{
                                        backgroundColor: 'white',
                                        marginBottom: 1,
                                        width: '100%',
                                        marginTop: 1,
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginBottom: 2,
                                }}
                            >
                                {tempTranslations.map((tran) => (
                                    <Button
                                        key={tran.id}
                                        variant="contained"
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteTranslation(word.id, tran.id)}
                                        sx={{ marginBottom: 1 }}
                                    >
                                        {tran.word}  X {/*To signify this deletes */}
                                    </Button>
                                ))}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box
                                    sx={{
                                        marginBottom: 2,
                                        maxWidth: 400,
                                        maxHeight: 200,
                                        overflowY: 'scroll',
                                    }}
                                >
                                    {/*Make easy buttons out of all words from the opposing language */}
                                    {words
                                        .filter((w) => w.lang_id !== word.lang_id)
                                        .map((w) => (
                                            <Button
                                                key={w.id}
                                                variant='outlined'
                                                onClick={() => handleAddTranslation(word.id, w.id)}
                                                sx={{ margin: 1, color: 'white', borderColor: 'white' }}
                                            >
                                                {w.word}
                                            </Button>
                                        ))}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant='contained'
                                    onClick={async () => {
                                        adjustWord(word.id, editLang, editedWord);
                                    }}
                                    sx={{ marginTop: 3 }}
                                >
                                    Save word and language edit
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={() => setEditMode(null)}
                                    sx={{ marginTop: 3, marginLeft: 2 }}
                                >
                                    Exit
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            key={word.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='error'
                                onClick={() => handleDelete(word.id)}
                                sx={{ marginLeft: 2, backgroundColor: 'red' }}
                            >
                                Delete
                            </Button>
                            <Typography sx={{ color: 'white' }}>{word.word}</Typography>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setEditLang(word.lang_id);
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
