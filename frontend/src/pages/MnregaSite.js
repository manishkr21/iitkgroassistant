import React, { useId } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import data from "../resources/mnregaDatabase.json";
import TopNavBar from '../components/Navigation'

const MnregaSite = () => {
  const { workers, work } = data;

  return (

    <>
    <TopNavBar />
    <Box sx={{ mx: "auto", mt: 4 , width: '90%', margin: "64px auto 0 auto" }}>

      {/* Accordion 1: Workers */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">👷 Workers</Typography>
        </AccordionSummary>
        <AccordionDetails id="workerId">
          {workers.map((worker) => (
            <Box key={worker.worker_id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {worker.name} ({worker.worker_id})
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary={`Age: ${worker.age}`} />
                  <ListItemText primary={`Gender: ${worker.gender}`} />
                  <ListItemText primary={`Caste: ${worker.caste}`} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`Aadhaar Linked: ${worker.aadhaar_linked ? "Yes" : "No"}`}
                  />
                  <ListItemText primary={`Mobile: ${worker.mobile}`} />
                  <ListItemText primary={`Village: ${worker.village}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Block: ${worker.block}`} />
                  <ListItemText primary={`District: ${worker.district}`} />
                  <ListItemText primary={`State: ${worker.state}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Bank: ${worker.bank_name}`} />
                  <ListItemText primary={`A/C: ${worker.bank_account}`} />
                  <ListItemText primary={`IFSC: ${worker.ifsc}`} />
                </ListItem>
              </List>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Accordion 2: Work */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">🛠️ Works</Typography>
        </AccordionSummary>
        <AccordionDetails id="workId">
          {work.map((w) => (
            <Box key={w.work_id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {w.work_name} ({w.work_id})
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemText primary={`Location: ${w.location}`} />
                  <ListItemText primary={`Block: ${w.block}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`District: ${w.district}`} />
                  <ListItemText primary={`State: ${w.state}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Start Date: ${w.start_date}`} />
                  <ListItemText primary={`End Date: ${w.end_date}`} />
                </ListItem>
              </List>

              {/* Nested Workers List */}
              {w.workers && w.workers.length > 0 && (
                <Box sx={{ mt: 2, pl: 2, borderLeft: "3px solid #2196f3" }}>
                  <Typography variant="subtitle2" gutterBottom>
                   Workers Involved:
                  </Typography>
                  <List dense>
                    {w.workers.map((worker) => (
                      <ListItem key={worker.worker_id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography variant="body2">
                          {worker.worker_id} - {worker.name}
                        </Typography>
                        <Typography variant="body2">
                          Days Worked: {worker.total_days} | Wage/Day: ₹{worker.wage_per_day}
                        </Typography>
                        <Typography variant="body2">
                          Total: ₹{worker.total_amount} | Paid: ₹{worker.paid_amount}
                        </Typography>
                      </ListItem>
                      
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>


    </Box>
    </>
  );
};

export default MnregaSite;
