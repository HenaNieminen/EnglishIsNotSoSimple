import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import { postWords, postTrans } from '../context/backendfunc'
import { TextField, Typography, Button, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material/';
import { toast } from 'react-toastify';

const Adder = () => {
    const { langs, syncData } = useContext(DataContext);
    const [ addMode, setAddMode ] = useState(false);
    const [ postedWord, setPostedWord ] = useState('');
    const [ postedLang, setPostedLang ] = useState('');
    const [ postedTrans, setPostedTrans ] = useState('');

    const sendWord = async (lang_id, word) => {
        try {
            const postedWord = { lang_id, word };
            await postWords(postedWord);
            await syncData();
            toast.success("Word added succesfully!");
        } catch (error) {
            if (error.status === 409) {
                toast.error("Word already exists!");
                return;
            };
            console.error('Error posting word', error);
            toast.error(`Something went wrong. Error code: ${error.status}`);
        };
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 5,
            }}
        >
        {/*Button to open the menu*/}
        {!addMode && (
            <Button
                variant="contained"
                onClick={() => setAddMode(true)}
                sx={{ marginBottom: 3 }}
            >
                Add a new word
            </Button>
            )}
        {addMode && (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 400,
                    maxWidth: 900,
                    maxHeight: 200,
                    margin: 'auto',
                    backgroundColor: '#525252',
                    padding: 5,
                    }}
                >
                <Typography variant="h5" sx={{ color: 'white', marginBottom: 1 }}> Add a new word</Typography>
                    <FormControl sx={{ marginBottom: 2 }}>
                        <InputLabel id="language-select-label">Language</InputLabel>
                        <Select
                            labelId="language-select-label"
                            value={postedLang}
                            size="small"
                            onChange={(e) => setPostedLang(e.target.value)}
                            label="Language"
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
                        size="small"
                        label="New word"
                        value={postedWord}
                        onChange={(e) => setPostedWord(e.target.value)}
                        sx={{ backgroundColor: 'white', marginBottom: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setAddMode(false)}
                            sx={{ marginTop: 3 }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!postedLang || !postedWord}
                            onClick={async () => {
                                await sendWord(postedLang, postedWord);
                            }}
                            sx={{ marginTop: 3 }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Adder;
