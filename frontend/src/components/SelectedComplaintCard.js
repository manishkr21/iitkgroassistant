import React from 'react';
import {
    Card,
    Typography,
    Divider,
    Stack,
} from '@mui/material';

function toTitleCase(str) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

const labelMap = {
    registration_no: "Registration Number",
    ppo_no: "PPO Number",
    work_id: "Work ID",
    type: "Type",
    worker_id: "Worker ID",
    state: "State",
    district: "District",
    ministry: "Ministry",
    recvd_date: "Received Date",
    name: "Name",
    grievance_description: "Grievance Description"
};

const formatValue = (key, value) => {
    if (!value) return false;
    if (key === 'recvd_date') return new Date(value).toLocaleDateString();
    if (['name', 'state', 'district'].includes(key)) return toTitleCase(value);
    return value;
};

const SelectedComplaintCard = (props) => {
    return (
        <Card variant="outlined" sx={{ p: 2, margin: "0 auto" }}>
            <Typography variant="h6" gutterBottom>
                <strong>{labelMap['registration_no']}:</strong> {props.registration_no}
            </Typography>

            <Divider sx={{ my: 1 }} />
            <Stack spacing={2}>
                {Object.entries(props).map(([key, value]) => {
                    const formattedValue = formatValue(key, value);
                    if (key === 'registration_no' || !labelMap[key] || formattedValue === false) return null;

                    return (
                        <Typography key={key}>
                            <strong>{labelMap[key]}:</strong> {formattedValue}
                        </Typography>
                    );
                })}
            </Stack>

        </Card>
    );
};

export default SelectedComplaintCard;
