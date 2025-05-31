import React, { useEffect, useState } from 'react';
import {
  Box, CircularProgress, Typography
} from '@mui/material';
import ComplaintCard from '../components/ComplaintCard';
import SelectedComplaintCard from '../components/SelectedComplaintCard';
import grievanceData from '../resources/grievanceDatabase.json';
import LLMQuery from '../components/LLMQuery';
import TopNavBar from '../components/Navigation'

const Grievances = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    setFilteredData(grievanceData || []);
    setLoading(false);
  }, []);


  const handleRegistrationClick = (item) => {
    setSelectedCard(item);
  };



  return (
    <>
      <TopNavBar />


      <Box display="flex" sx={{ width: '90%', height: 'calc(100vh - 64px)', margin: "64px auto 0 auto", overflow: 'hidden' }}>
        {/* Sidebar for Search and Complaint List */}

        <Box sx={{ width: '20%', p: 2, borderRight: '1px solid #ddd', overflowY: 'auto' }} id="style-4">
     
          {loading ? (
            <CircularProgress />
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              {filteredData.map((item, index) => (
                <Box key={index} onClick={() => handleRegistrationClick(item)}>
                  <ComplaintCard
                    registration_no={item.registration_no}
                    state={item.state}
                    district={item.district}
                    name={item.name}
                    type={item.type}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Main Content for Selected Complaint Details */}
        <Box sx={{ width: '45%', p: 2, bgcolor: '#f7f7f7', overflowY: 'auto' }}>
          {selectedCard ? (
            <SelectedComplaintCard
              registration_no={selectedCard.registration_no}
              ppo_no={selectedCard.ppo_no}
              work_id={selectedCard.work_id}
              worker_id={selectedCard.worker_id}
              grievance_description={selectedCard.grievance_description}
              state={selectedCard.state}
              district={selectedCard.district}
              ministry={selectedCard.ministry}
              recvd_date={selectedCard.recvd_date}
              name={selectedCard.name}
            />
          ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Select a complaint to view details
            </Typography>
          )}
        </Box>
        {/* Right Sidebar for Additional Information */}
        <Box sx={{ width: '35%', bgcolor: '#f7f7f7', overflowY: 'auto' }}>
          {selectedCard && <LLMQuery type={selectedCard.type} unique_id1={selectedCard.ppo_no || selectedCard.worker_id} unique_id2={selectedCard.work_id} grievance_description={selectedCard.grievance_description} />}
        </Box>
      </Box>
    </>
  );
};

export default Grievances;