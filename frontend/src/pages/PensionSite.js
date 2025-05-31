import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Chip
} from '@mui/material';
import pensionData from '../resources/pensionDatabase.json'; // Assuming you have a JSON file with pension data
import TopNavBar from '../components/Navigation'


const PensionSite = () => {
    const toTitleCase = (str) => {
        return str
          .toLowerCase()
          .replace(/\b\w/g, char => char.toUpperCase());
      };

    return (
        <>
        <TopNavBar />
        
        <Paper elevation={3} sx={{ padding: 2 , margin: "64px auto", width: '90%' }}>
            <Typography variant="h6" gutterBottom>
                Pension System Records
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Pensioner ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>District</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Updated Living Certificate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pensionData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.ppo_no}</TableCell>
                                <TableCell>{toTitleCase(row.name)}</TableCell>
                                <TableCell>{toTitleCase(row.state)}</TableCell>
                                <TableCell>{toTitleCase(row.district)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        color={row.status === 'Active' ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{row.lastupdated}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        </>

    );
};

export default PensionSite;