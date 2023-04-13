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
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  CardActions,
} from "@mui/material";
import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { createTheme, ThemeProvider, colors } from "@mui/material";
import { patientTheme } from "../Themes";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { Patient } from "../types/PatientDataType";
import { useState, useEffect } from "react";
import {
  listAppointment,
  selectPatientAppointmentList,
} from "../features/patient/patientAppointmentSlice";
import { useAppDispatch } from "../app/hooks";
import { Appointment } from "../types/AppointmentType";
import { updateAppointment } from "../features/patient/patientAppointmentSlice";
import { MoreVert } from "@mui/icons-material";

export default function PatientDashboardScreen(props: any) {
  const { userInfo } = useAppSelector(selectUserLogIn);
  const patientAppointmentList = useAppSelector(selectPatientAppointmentList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleAppointments = () => {
    navigate(`/patient/assessment`);
  };
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment>();
  const handleDetailButtonClick = (appointment: Appointment) => {
    // setSelectedPatient(patient);
    setAppointmentDetail(appointment);
    setShowDetailDialog(true);
  };
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleClose = () => {
    // setShowAssessmentDialog(false);
    setShowDetailDialog(false);
  };

  const handleAccept = (appointment: Appointment) => {
    if (userInfo) {
      dispatch(
        updateAppointment(
          userInfo.token,
          userInfo.userData,
          appointment,
          "ACCEPTED"
        )
      );
    }
  };

  const handleReject = (appointment: Appointment) => {
    if (userInfo) {
      dispatch(
        updateAppointment(
          userInfo.token,
          userInfo.userData,
          appointment,
          "REJECTED"
        )
      );
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(listAppointment(userInfo.token, userInfo.userData));
    }
  }, []);

  return (
    <ThemeProvider theme={patientTheme}>
      <Stack padding={2} spacing={2}>
        <Typography variant="h4" color={"primary.contrastText"}>
          Good day! Dear {userInfo?.userData.name}!
        </Typography>
        {/* <Typography variant="h5" color={"primary.contrastText"}>
          How can we help you?
        </Typography> */}
        <Box>
          <Typography sx={{ fontSize: 19, marginTop: 3 }}>
            The Patient Health Questionnaire (PHQ) is a validated diagnostic and
            severity assessment tool for depressive disorders. A number of
            different versions exist, each with their own benefits and
            tradeoffs.
          </Typography>
          <Typography sx={{ fontSize: 19 }}>
            In our questionnaires, we use the PHQ-9 which has been shown to be
            highly effective. Additionally, it is an impeccable questionaaire to
            assess depression and anxiety.
          </Typography>
          <Typography sx={{ fontSize: 19 }}>
            <br></br>
            Click on the SELF-ASSESSMENT button below to start your journey of
            self heal.
          </Typography>
        </Box>
        {/* if the assessment is not completed */}
        {/* <Button variant="contained">Complete the assessment</Button> */}
        {/* if the assessment is completed, the patient can view the appointment schedule and decide to accept/reject it */}
        <Button
          variant="contained"
          onClick={handleAppointments}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          Self-Assessment
        </Button>
        <Divider />

        <Stack>
          {patientAppointmentList.acceptedFutureAppointments.length > 0 && (
            <Typography variant="h5" color="primary.contrastText">
              Accepted Future Appointments
            </Typography>
          )}
          {patientAppointmentList.acceptedFutureAppointments.length > 0 && (
            <Grid container justifyContent={"start"} sx={{ marginTop: 1 }}>
              {patientAppointmentList.acceptedFutureAppointments.map(
                (appointment) => (
                  (appointment.name != "" && appointment.name != null) &&
                  <Grid
                    key={`${appointment.name}${appointment.slotDate}${appointment.slotTime}`}
                  >
                    <Box maxWidth={450} maxHeight={150}>
                      <Card
                        sx={{
                          marginTop: 5,
                          boxShadow: 3,
                          marginLeft: 1,
                          height: 150,
                          width: 430,
                        }}
                      >
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between">
                            <Stack direction="row">
                              <ListItemAvatar sx={{ display: "flex" }}>
                                <Avatar
                                  alt="doctor"
                                  src="/static/images/doctor/sampleDoctor.jpg"
                                  sx={{ alignSelf: "center" }}
                                />
                              </ListItemAvatar>
                              <Stack direction={"column"}>
                                <Typography>{appointment.name}</Typography>
                                <Typography>
                                  Date:{appointment.slotDate}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-around" }}>
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
                            <MoreVert />
                          </Button>
                          {appointment.status !== "ACCEPTED" &&
                            appointment.status !== "REJECTED" && (
                              <Button
                                variant="contained"
                                color="secondary"
                                sx={{
                                  color: "primary.contrastText",
                                  marginRight: 2,
                                  borderColor: "secondary.dark",
                                  ":hover": {
                                    backgroundColor: "secondary.dark",
                                  },
                                }}
                                onClick={() => handleReject(appointment)}
                              >
                                Reject
                              </Button>
                            )}
                          {appointment.status !== "ACCEPTED" &&
                            appointment.status !== "REJECTED" && (
                              <Button
                                variant="outlined"
                                onClick={() => handleAccept(appointment)}
                                sx={{
                                  backgroundColor: "primary.dark",
                                  color: "primary.contrastText",
                                  ":hover": {
                                    backgroundColor: "primary.main",
                                  },
                                }}
                              >
                                Accept
                              </Button>
                            )}

                          {(appointment.status === "ACCEPTED" ||
                            appointment.status === "REJECTED") && (
                              <Button variant="outlined" disabled>
                                {appointment.status}
                              </Button>
                            )}
                        </CardActions>
                      </Card>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          )}

          {patientAppointmentList.pendingFutureAppointments.length === 0 &&
            patientAppointmentList.acceptedFutureAppointments.length === 0 && (
              <Typography variant="h5" color="primary.contrastText">
                No Future Appointments to Process
              </Typography>
            )}
          {patientAppointmentList.pendingFutureAppointments &&
            patientAppointmentList.pendingFutureAppointments.length > 0 && (
              <Typography variant="h5" color="primary.contrastText">
                Incoming Appointments
              </Typography>
            )}

          <Grid container justifyContent={"start"} sx={{ marginTop: 1 }}>
            {patientAppointmentList.pendingFutureAppointments.map(
              (appointment) => (
                (appointment.name != "" && appointment.name != null) &&
                <Grid
                  key={`${appointment.name}${appointment.slotDate}${appointment.slotTime}`}
                >
                  <Box maxWidth={450} maxHeight={150}>
                    <Card
                      sx={{
                        marginTop: 5,
                        boxShadow: 3,
                        marginLeft: 1,
                        height: 150,
                        width: 430,
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row">
                            <ListItemAvatar sx={{ display: "flex" }}>
                              <Avatar
                                alt="doctor"
                                src="/static/images/doctor/sampleDoctor.jpg"
                                sx={{ alignSelf: "center" }}
                              />
                            </ListItemAvatar>
                            <Stack direction={"column"}>
                              <Typography>{appointment.name}</Typography>
                              <Typography>
                                Date:{appointment.slotDate}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-around" }}>
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
                          <MoreVert />
                        </Button>
                        {appointment.status !== "ACCEPTED" &&
                          appointment.status !== "REJECTED" && (
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{
                                color: "primary.contrastText",
                                marginRight: 2,
                                borderColor: "secondary.dark",
                                ":hover": {
                                  backgroundColor: "secondary.dark",
                                },
                              }}
                              onClick={() => handleReject(appointment)}
                            >
                              Reject
                            </Button>
                          )}
                        {appointment.status !== "ACCEPTED" &&
                          appointment.status !== "REJECTED" && (
                            <Button
                              variant="outlined"
                              onClick={() => handleAccept(appointment)}
                              sx={{
                                backgroundColor: "primary.dark",
                                color: "primary.contrastText",
                                ":hover": {
                                  backgroundColor: "primary.main",
                                },
                              }}
                            >
                              Accept
                            </Button>
                          )}

                        {(appointment.status === "ACCEPTED" ||
                          appointment.status === "REJECTED") && (
                            <Button variant="outlined" disabled>
                              {appointment.status}
                            </Button>
                          )}
                      </CardActions>
                    </Card>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Stack>

        <Dialog open={showDetailDialog} onClose={handleClose}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Appointment Detail
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Patient Info
            </Typography>
            <Typography variant="subtitle1">
              Patient ID: {userInfo?.userData.id}
            </Typography>
            <Typography variant="subtitle1">
              Patient Name: {userInfo?.userData.name}
            </Typography>
            <Typography variant="subtitle1">
              Patient Email: {userInfo?.userData.email}
            </Typography>
            {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Assessment Test
            </Typography>
            <Typography variant="subtitle1">
              Status: Pass
            </Typography> */}
            {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Assignment Comment 
            </Typography> */}

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Expert Info
            </Typography>
            <Typography variant="subtitle1">
              Expert Position: {appointmentDetail?.type}
            </Typography>
            <Typography variant="subtitle1">
              Expert Name: {appointmentDetail?.name}
            </Typography>
            <Typography variant="subtitle1">
              Expert Email:{" "}
              {appointmentDetail?.slotAssignedTo
                ? appointmentDetail?.slotAssignedTo
                : appointmentDetail?.slotAssignedBy}
            </Typography>
            {/* <Typography variant="subtitle1">
              Doctor: Dr. Gregory House
            </Typography> */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Appointment Info
            </Typography>
            <Typography variant="subtitle1">
              Status: {appointmentDetail?.status}
            </Typography>
            <Typography variant="subtitle1">
              Date: {appointmentDetail?.slotDate}
            </Typography>
            <Typography variant="subtitle1">
              Timeslot: {appointmentDetail?.slotTime}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
              Meeting Link:
              <a href={appointmentDetail?.meetingLink} target="_blank" rel="noreferrer">
                {appointmentDetail?.meetingLink}
              </a>
            </Typography>
            {/* <Typography variant="subtitle1">
              Notes:
            </Typography> */}
          </DialogContent>
        </Dialog>
      </Stack>
    </ThemeProvider>
  );
}
