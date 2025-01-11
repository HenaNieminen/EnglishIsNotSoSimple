import { useContext, useState } from 'react';
import { DataContext } from '../context/datacontext';
import { postWords } from '../context/backendfunc'
import { TextField, Typography, Button, Box } from '@mui/material/';

const Adder = () => {
    const { syncData } = useContext(DataContext);

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

        </Box>
    );
}

export default Adder;