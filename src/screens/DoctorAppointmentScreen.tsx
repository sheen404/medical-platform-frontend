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
  Card,
  Grid
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { doctorTheme } from "../Themes";
import { defaultPatient, Patient } from "../types/PatientDataType";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPatients, selectDoctor } from "../features/doctor/doctorSlice";
import { ansList, questions } from "./PatientAssessmentScreen";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { roleToPosition } from "../constants/PositionRoleMap";
import { isAppointmentExpired } from "../utils/AppointmentConversion";
import { Appointment } from "../types/AppointmentType";
import { setLastDate, setLastTimeslot, setPatient } from "../features/appointment/appointmentSlice";
import { listAppointment, selectDoctorAppointmentList } from "../features/doctor/doctorAppointmentSlice";
import { useNavigate } from "react-router";

export default function DoctorAppointmentScreen(props: any) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment>();
  const { userInfo } = useAppSelector(selectUserLogIn);
  const doctorAppointmentList = useAppSelector(selectDoctorAppointmentList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDetailButtonClick = (appointment: Appointment) => {
    setAppointmentDetail(appointment);
    setShowDetailDialog(true);
  };
  const handleClose = () => {
    setShowDetailDialog(false);
  };

  const handleModify = (appointment: Appointment) => {
    if (userInfo) {
      dispatch(setPatient({ ...defaultPatient, email: appointment.slotAssignedTo, name: appointment.name } as Patient))
      dispatch(setLastDate(appointment.slotDate));
      dispatch(setLastTimeslot(appointment.slotTime));
      navigate("/doctor/modify_appointment");
    }
  }

  useEffect(() => {
    if (userInfo) {
      dispatch(listAppointment(userInfo.token, userInfo.userData))
    }
  }, [])

  return (
    <ThemeProvider theme={doctorTheme}>
      <Grid item container>
        <Grid item container direction="column" md={12}>
          <Typography variant="h4" marginLeft="1rem">
            Appointments Assigned
          </Typography>
          <List>
            {doctorAppointmentList.appointments.map((appointment) =>
            (<ListItem key=
              {`${appointment.name}${appointment.slotDate}${appointment.slotTime}`}
            >
              <Box sx={{ width: "100%" }}>
                <Card sx={{ marginTop: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row">
                        <ListItemAvatar sx={{ display: "flex" }}>
                          <Avatar
                            alt={`${appointment.name}`}
                            src="/static/images/doctor/sampleDoctor.jpg"
                            sx={{ alignSelf: "center" }}
                          />
                        </ListItemAvatar>
                        <Stack direction={"column"}>
                          <Typography>{appointment.name}</Typography>
                          <Typography>Date:{appointment.slotDate}</Typography>
                        </Stack>
                      </Stack>
                      <Stack direction={"row"}>
                        <Button
                          variant="contained"
                          // variant="outlined"
                          onClick={() => handleDetailButtonClick(appointment)}
                          sx={{
                            marginRight: 2,
                            backgroundColor: "primary",
                            color: "primary.contrastText",
                            ":hover": {
                              color: "primary.contrastText",
                              backgroundColor: "secondary.main",
                            },
                          }}
                        >
                          Details
                        </Button>
                        {appointment.status === "ASSIGNED" &&
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              marginRight: 2,
                              borderColor: "secondary.dark",
                              ":hover": { backgroundColor: "secondary.dark" },
                            }}
                            onClick={() => handleModify(appointment)}
                            disabled={appointment.status !== "ASSIGNED"}
                          >
                            Modify
                          </Button>
                        }

                        {(appointment.status !== "ASSIGNED" ||
                          isAppointmentExpired(appointment)) &&
                          <Button
                            variant="outlined"
                            disabled
                          >
                            {appointment.status}
                            {isAppointmentExpired(appointment) && " EXPIRED"}
                          </Button>
                        }
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </ListItem>)
            )}

          </List>

        </Grid>
        {/* <Grid item container direction="column" md={12} lg={6}>
          <Grid item container md={12} lg={6} direction="column">
            <Typography variant="h4" color={"primary.contrastText"} marginLeft="1rem">
              Appointments for Me
            </Typography>
            <List sx={{ flexGrow: 1 }}>
              {patients.map((patient) => (
                <ListItem key={patient.id}>
                  <Box sx={{ width: "100%" }}>
                    <Card sx={{ boxShadow: 3, marginTop: 1 }}>
                      <CardContent>
                        <Stack direction="row" justifyContent={"space-between"}>
                          <Stack direction="row">
                            <ListItemAvatar sx={{ display: "flex" }}>
                              <Avatar alt="patient" src="" sx={{ alignSelf: "center" }} />
                            </ListItemAvatar>
                            <Stack direction={"column"} sx={{ marginRight: 3 }}>
                              <Typography>{patient.name}</Typography>
                              <Typography>{`ID: ${patient.id}`}2</Typography>
                            </Stack>
                            <Button
                              variant="contained"
                            >
                              Self-Assessment
                            </Button>
                          </Stack>
                          <Stack
                            direction={"row"}
                            spacing={2}
                            sx={{ flexDirection: "row" }}
                          >
                            <Button variant="contained"
                            >Accept</Button>
                            <Button variant="contained" color="secondary">
                              Reject
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>

        </Grid> */}
      </Grid>
      <Dialog open={showDetailDialog} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Patient Name: {appointmentDetail?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">
            Slot Assigned By: {userInfo?.userData.email}
          </Typography>
          {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Assessment Test
          </Typography>
          <Typography variant="subtitle1">
            Status: Pass
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Assignment Comment
          </Typography>
          <Typography variant="subtitle1">
            Counselor: Harsh Singh
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Appointment Comment
          </Typography> */}
          <Typography variant="subtitle1">
            Slot Assigned To: {appointmentDetail?.slotAssignedTo}
          </Typography>
          <Typography variant="subtitle1">
            Date: {appointmentDetail?.slotDate}
          </Typography>
          <Typography variant="subtitle1">
            Timeslot: {appointmentDetail?.slotTime}
          </Typography>
        </DialogContent>
      </Dialog>
    </ThemeProvider>)
}
