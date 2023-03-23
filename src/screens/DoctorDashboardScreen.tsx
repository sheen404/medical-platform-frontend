import { CheckBox } from "@mui/icons-material";
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
  Checkbox,
  IconButton,
  Card,
  CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions
} from "@mui/material";
import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { createTheme, ThemeProvider, colors } from "@mui/material";
import { doctorTheme } from "../Themes";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { useNavigate } from "react-router-dom";
import { fetchPatients, selectDoctor, updatePatientStatus } from "../features/doctor/doctorSlice";
import { useEffect, useState } from "react";
import { Patient } from "../types/PatientDataType";

export default function DoctorDashboardScreen(props: any) {
  const doctor = useSelector((state: RootState) => state.doctor);
  const { userInfo } = useAppSelector(selectUserLogIn);
  const { patients } = useAppSelector(selectDoctor);

  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reason, setReason] = useState("");
  const handleClickOpen = (patient: any) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const handleAppointments = () => {
    navigate(`/doctor/appointments`);
  };
  const handleAccept = (patient: Patient) => {
    dispatch(updatePatientStatus(patient.email, "", ""));
  };

  const handleReject = () => {
    if (selectedPatient)
      dispatch(updatePatientStatus(selectedPatient.email, "REJECT_PATIENT", reason));
    setReason("");
    setOpen(false);

  };


  useEffect(() => {
    if (userInfo)
      dispatch(fetchPatients(userInfo.userData.email));
  }, []);

  return (
    <ThemeProvider theme={doctorTheme}>
      <Stack padding={2} spacing={2}>
        <Typography variant="h4">
          Good day! Dear {userInfo?.userData.name}!
        </Typography>
        <Typography variant="h5">How can we help you?</Typography>
        {/* if the assessment is not completed */}
        {/* <Button variant="contained">Complete the assessment</Button> */}
        {/* if the assessment is completed, the patient can view the appointment schedule and decide to accept/reject it */}
        <Button variant="contained" onClick={handleAppointments}>
          View Appointments
        </Button>
        <Divider />

        <Stack>
          <Typography variant="h5">Recent Appointments</Typography>
          <List>
            <ListItem>
              <Box width={"100%"}>
                {patients.map(
                  patient => (
                    <Card sx={{ boxShadow: 3, marginTop: 1 }} key={patient.id}>
                      <CardContent>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                          <Stack direction={"row"}>
                            <ListItemAvatar sx={{ display: "flex" }}>
                              <Avatar sx={{ alignSelf: "center" }}
                                      alt={patient.name}
                                      src="/static/images/doctor/samplePatient.jpg"
                              />
                            </ListItemAvatar>
                            <Stack direction={"column"}>
                              <Typography>{patient.name}</Typography>
                              <Typography>Date: {patient.dob}</Typography>
                            </Stack>
                          </Stack>
                          <Stack direction={"row"}>
                            <Button variant="contained"
                                    sx={{ marginRight: 2 }}
                                    onClick={() => handleAccept(patient)}
                            >
                              Accept
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => handleClickOpen(patient)}>
                              Reject
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  )
                )}


                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Reject Patient {selectedPatient?.name}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please provide a reason for rejecting this patient.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Reason"
                      type="text"
                      fullWidth
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleReject} color="error">
                      Reject
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
