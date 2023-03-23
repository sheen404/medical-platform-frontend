import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  ThemeProvider,
  CardContent,
  Card
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { doctorTheme } from "../Themes";
import { defaultPatient, Patient } from "../types/PatientDataType";
import { useAppSelector } from "../app/hooks";
import { selectDoctor } from "../features/doctor/doctorSlice";
import { ansList, questions } from "./PatientAssessmentScreen";

export default function DoctorAppointmentScreen(props: any) {
  const { patients } = useAppSelector(selectDoctor);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);


  const handleAssessmentButtonClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowAssessmentDialog(true);
  };

  const handleDetailButtonClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetailDialog(true);
  };

  const handleClose = () => {
    setShowAssessmentDialog(false);
    setShowDetailDialog(false);
  };

  return (
    <ThemeProvider theme={doctorTheme}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Assigned Patients
        </Typography>
        <List>
          {patients.map((patient) => (
            <ListItem key={patient.id}>
              <Box sx={{ width: "100%" }}>
                <Card sx={{ boxShadow: 3, marginTop: 1 }}>
                  <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"row"}>
                        <ListItemAvatar sx={{ display: "flex" }}>
                          <Avatar alt="patient" src="" sx={{ alignSelf: "center" }} />
                        </ListItemAvatar>
                        <Stack direction={"column"}>
                          <Typography>{patient.name}</Typography>
                          <Typography>{`ID: ${patient.id}`}2</Typography>
                        </Stack>
                      </Stack>
                      <Stack direction={"row"}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAssessmentButtonClick(patient)}
                          sx={{ marginRight: 2 }}
                          disabled={patient.assessmentOptionsSelected.length === 0}
                        >
                          Self-Assessment
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDetailButtonClick(patient)}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </ListItem>
          ))}
        </List>
        <Dialog open={showAssessmentDialog} onClose={handleClose}>
          <DialogTitle sx={{ fontWeight: "bold", fontSize: 30 }}>
            {selectedPatient?.name} Self-Assessment Results
          </DialogTitle>
          <DialogContent>
            <Stack direction={"row"} justifyContent={"space-around"}>
              <Typography variant="subtitle1">
                ID: {selectedPatient?.id}
              </Typography>
              <Typography variant="subtitle1">
                Name: {selectedPatient?.name}
              </Typography> </Stack>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>

            </Typography>
            <Stack spacing={2} pt={1}>
              {questions.map((question) => (
                <Paper key={question.id} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{question.text}</Typography>
                  <Typography
                    variant="body1">{`${selectedPatient && selectedPatient.assessmentOptionsSelected[question.id - 1] ?
                    ansList[selectedPatient.assessmentOptionsSelected[question.id - 1].charCodeAt(0) - 97] : "N/A"
                  }`}</Typography>
                </Paper>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>
        <Dialog open={showDetailDialog} onClose={handleClose}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {selectedPatient?.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              ID: {selectedPatient?.id}
            </Typography>
            <Typography variant="subtitle1">
              Name: {selectedPatient?.name}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Detailed Information
            </Typography>
            <Typography variant="subtitle1">
              Address: {selectedPatient?.address}
            </Typography>
            <Typography variant="subtitle1">
              Date of Birth: {selectedPatient?.dob}
            </Typography>
            <Typography variant="subtitle1">
              Phone Number: {selectedPatient?.phone}
            </Typography>
            <Typography variant="subtitle1">
              Email Address: {selectedPatient?.email}
            </Typography>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
