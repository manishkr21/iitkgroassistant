import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';


// color paletteProvider component to wrap the app
const ColorPaletteProvider = ({ children }) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#D3B77F', // light Brown
                second: '#fff',   // White
            },
            secondary: {
                main: '#be9441', // Dark Brown (Chocolate)
                second: '#eee', // White
            },
            chat: {
                main: '#D3B77F', // Indigo
                second: '#A66E38', // White
            },
            background: {
                default: '#FFF8E1', // Light Cream
                paper: '#FFFFFF',   // Paper white
            },
            text: {
                primary: '#645e5e', // Dark text
                secondary: '#757575', // Grey text
            },
            action: {
                active: '#FF40ee', // Color for active icons like call
            },
        },
        typography: {
            main: "#696969",
            second: "#D3D3D3",
            third: "#333",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 'bold',
            },
            body1: {
                fontSize: '1.1rem',
            },
            body2: {
                fontSize: '0.95rem',
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export default ColorPaletteProvider;