// TopNavBar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Optional if you're using React Router

const TopNavBar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#ffedc1', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GRO Assistant
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/pension">Pension</Button>
          <Button color="inherit" component={Link} to="/mnrega">MNREGA</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
