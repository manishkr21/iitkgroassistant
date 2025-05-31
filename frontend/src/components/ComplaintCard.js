import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Person as PersonIcon, LocationOn as LocationIcon } from '@mui/icons-material';


function toTitleCase(str) {
    if (str === null || str === undefined) {
        return '';
    }
    if (typeof str !== 'string') {
        return str; // Return as is if not a string
    }

    return str
      .toLowerCase()
      .split(' ')
      .map(word =>
        word
          .split(/([-'])/)
          .map(part =>
            part.match(/[-']/) ? part : part.charAt(0).toUpperCase() + part.slice(1)
          )
          .join('')
      )
      .join(' ');
  }
  

const ComplaintCard = ({ state, district, name, type }) => (

    <Card variant="outlined" sx={{ position: 'relative', backgroundColor: "#fff9ed", border: "1px solid rgba(0, 0, 0, 0.12)" }}>

        <CardContent sx={{ cursor: 'pointer', padding: '8px' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="#2854d9" fontSize='32px' />
                    <Typography variant="body2">{toTitleCase(name)}</Typography>
                </Box>
                <Chip
                    label={toTitleCase(type)}
                    size="small"
                    sx={{
                        backgroundColor: '#e3a460',
                        color: 'white',
                        fontWeight: 500,
                        height: '22px',
                    }}
                />
            </Box>


            <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: '4px' }} >
                <LocationIcon color="#2854d9" fontSize='32px' />
                <Typography variant="body2">{`${toTitleCase(district)}, ${toTitleCase(state)}`}</Typography>

            </Box>

        </CardContent>
    </Card >
);

export default ComplaintCard;