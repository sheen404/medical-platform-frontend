import {
  createTheme,
  ThemeProvider,
  colors,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
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
} from "@mui/material";
import * as React from "react";
import { patientTheme } from "../Themes";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  listAppointment,
  selectPatientAppointmentList,
  updateAppointment,
} from "../features/patient/patientAppointmentSlice";
import { Appointment } from "../types/AppointmentType";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import dayjs from "dayjs";
import { isAppointmentExpired } from "../utils/AppointmentConversion";
import { MoreVert } from "@mui/icons-material";

export default function PatientAppointmentScreen(props: any) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment>();
  const { userInfo } = useAppSelector(selectUserLogIn);
  const patientAppointmentList = useAppSelector(selectPatientAppointmentList);
  const dispatch = useAppDispatch();

  const handleDetailButtonClick = (appointment: Appointment) => {
    // setSelectedPatient(patient);
    setAppointmentDetail(appointment);
    setShowDetailDialog(true);
  };
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
      <Stack>
        <Typography variant="h4" color={"primary.contrastText"}>
          Appointment History
        </Typography>

        <Grid
          container
          justifyContent={"start"}
          sx={{ marginTop: 1, marginLeft: 10 }}
        >
          {patientAppointmentList.appointments.length === 0 && (
            <Typography variant="h5">You have no appointment.</Typography>
          )}
          {patientAppointmentList.appointments.map((appointment) => (
            (appointment.name != "" && appointment.name != null) &&
            <Grid
              key={`${appointment.name}${appointment.slotDate}${appointment.slotTime}`}
            >
              <Box maxWidth={550} maxHeight={150}>
                <Card
                  sx={{
                    marginTop: 5,
                    boxShadow: 3,
                    marginLeft: 5,
                    height: 150,
                    width: 440,
                    marginRight: 5,
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
                          <Typography>Date:{appointment.slotDate}</Typography>
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

                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        color: "primary.contrastText",
                        marginRight: 2,
                        borderColor: "secondary.dark",
                        ":hover": { backgroundColor: "secondary.dark" },
                      }}
                      onClick={() => handleReject(appointment)}
                      disabled={appointment.status !== "ASSIGNED" || isAppointmentExpired(appointment)}
                    >
                      Reject
                    </Button>
                    {appointment.status === "ASSIGNED" &&
                      !isAppointmentExpired(appointment) && (
                        <Button
                          variant="outlined"
                          onClick={() => handleAccept(appointment)}
                          sx={{
                            backgroundColor: "primary.dark",
                            color: "primary.contrastText",
                            ":hover": { backgroundColor: "primary.main" },
                          }}
                        >
                          Accept
                        </Button>
                      )}

                    {(appointment.status !== "ASSIGNED" ||
                      isAppointmentExpired(appointment)) && (
                        <Button variant="outlined" disabled>
                          {appointment.status}
                          {isAppointmentExpired(appointment) && " EXPIRED"}
                        </Button>
                      )}
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
      <Dialog open={showDetailDialog} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Appointment Detail
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Your Info
          </Typography>
          {/* <Typography variant="subtitle1">
              Patient ID: {userInfo?.userData.id}
            </Typography> */}
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Name: {userInfo?.userData.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Email: {userInfo?.userData.email}
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
            <br></br>Expert Info
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Expert Position: {appointmentDetail?.type}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Expert Name: {appointmentDetail?.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Expert Email:{" "}
            {appointmentDetail?.slotAssignedTo
              ? appointmentDetail?.slotAssignedTo
              : appointmentDetail?.slotAssignedBy}
          </Typography>
          {/* <Typography variant="subtitle1">
              Doctor: Dr. Gregory House
            </Typography> */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <br></br>Appointment Info
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Status: {appointmentDetail?.status}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Date: {appointmentDetail?.slotDate}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
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
      {/* <Dialog open={showDetailDialog} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Patient Name: Rui
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">
            Patient ID: 1
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
          </Typography>
          <Typography variant="subtitle1">
            Doctor: Dr. Gregory House
          </Typography>
          <Typography variant="subtitle1">
            Date: 2023-02-12
          </Typography>
          <Typography variant="subtitle1">
            Notes:
          </Typography>
        </DialogContent>
      </Dialog> */}
    </ThemeProvider>
  );
}
