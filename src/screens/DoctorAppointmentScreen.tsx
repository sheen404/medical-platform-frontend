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
  DialogContentText,
  Container,
  ThemeProvider,
  CardContent,
  Card,
  Grid,
  TextField,
  DialogActions,
  CardActions,
  Snackbar,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState, FormEvent } from "react";
import { doctorTheme } from "../Themes";
import { defaultPatient, Patient } from "../types/PatientDataType";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPatients, selectDoctor } from "../features/doctor/doctorSlice";
import { ansList, questions } from "./PatientAssessmentScreen";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { roleToPosition } from "../constants/PositionRoleMap";
import { isAppointmentExpired } from "../utils/AppointmentConversion";
import { Appointment } from "../types/AppointmentType";
import {
  setLastDate,
  setLastTimeslot,
  setPatient,
} from "../features/appointment/appointmentSlice";
import {
  listAppointment,
  selectDoctorAppointmentList,
} from "../features/doctor/doctorAppointmentSlice";
import { useNavigate } from "react-router";
import { updateGoogleMeetLink } from "../features/auth/userLogInSlice";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Slide, { SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

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
      dispatch(
        setPatient({
          ...defaultPatient,
          email: appointment.slotAssignedTo,
          name: appointment.name,
        } as Patient)
      );
      dispatch(setLastDate(appointment.slotDate));
      dispatch(setLastTimeslot(appointment.slotTime));
      navigate("/doctor/modify_appointment");
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(listAppointment(userInfo.token, userInfo.userData));
    }
  }, []);

  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [text, setText] = useState("");
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  const handleMeetingOpen = () => {
    setOpen(true);
  };

  const handleMeetingSubmit = (e: FormEvent) => {
    e.preventDefault();
    //dispatch(link(meetingLink));


    setTransition(() => TransitionDown);
    setOpenSnackbar(true);
    if (userInfo && meetingLink) {
      dispatch(
        updateGoogleMeetLink(userInfo.token, userInfo.userData, meetingLink)
      );
      setText("Meeting Link Updated Successfully!");
      setOpen(false);
    } else {
      setText("Meeting Link cannot be empty!");
    }
  };

  const handleMeetingClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const [meetingLink, setMeetingLink] = useState(
    userInfo ? userInfo.userData.googleMeetLink : ""
  );

  return (
    <ThemeProvider theme={doctorTheme}>
      <Grid item container>
        <Grid item container direction="column" md={12} sx={{ marginTop: 2 }}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant="h4" marginLeft="1rem">
              Appointments Assigned
            </Typography>
            <Button
              onClick={handleMeetingOpen}
              sx={{
                color: "secondary.light",
                backgroundColor: "primary.dark",
                ":hover": { backgroundColor: "primary.main" },
                marginRight: 5,
                fontSize: 16,
              }}
            >
              Meeting Link
            </Button>
          </Stack>
          {/* <Stack
            justifyContent={"end"}
            alignItems={"end"}
            sx={{ marginTop: 1 }}
          >
            {meetingLink !== "" && (
              <Typography sx={{ fontSize: 18 }}>
                <a href={meetingLink} target="_blank" rel="noreferrer">
                  {meetingLink}
                </a>
              </Typography>
            )}
          </Stack> */}
          <Grid container justifyContent={"space-around"} sx={{ marginTop: 1 }}>
            {doctorAppointmentList.appointments.length === 0 && (
              <Typography variant="h5">You have no appointment.</Typography>
            )}
            {doctorAppointmentList.appointments.map((appointment) => (
              <Grid
                key={`${appointment.name}${appointment.slotDate}${appointment.slotTime}`}
                spacing={3}
                sx={{ marginTop: 1 }}
              >
                <Box maxWidth={420} maxHeight={350}>
                  <Card
                    sx={{
                      marginTop: 2,
                      boxShadow: 3,
                      marginLeft: 2,
                      width: 390,
                      height: 150,
                    }}
                  >
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
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderColor: "secondary.dark",
                          ":hover": { backgroundColor: "secondary.dark" },
                        }}
                        onClick={() => handleModify(appointment)}
                        disabled={appointment.status !== "ASSIGNED"}
                      >
                        Modify
                      </Button>


                      <Button variant="outlined" disabled>
                        {appointment.status}
                        {isAppointmentExpired(appointment) && " EXPIRED"}
                      </Button>
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
                            backgroundColor: "primary.dark",
                          },
                        }}
                      >
                        <MoreVertIcon />
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
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
          <Typography variant="subtitle1">
            Meeting Link:
            <a href={appointmentDetail?.meetingLink} target="_blank" rel="noreferrer">
              {appointmentDetail?.meetingLink}
            </a>
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Meeting Link</DialogTitle>
        <DialogContent>
          {meetingLink !== "" && (
            <Typography sx={{ fontSize: 18 }}>
              <a href={meetingLink} target="_blank" rel="noreferrer">
                {meetingLink}
              </a>
            </Typography>
          )}
          <DialogContentText sx={{ color: "primary.contrastText" }}>
            <br></br>Add/Change Meeting Link:
          </DialogContentText>
          <form onSubmit={handleMeetingSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="meeting_link"
              label="Meeting Link"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setMeetingLink(e.target.value)}
              sx={{ color: "primary.dark" }}
              value={meetingLink}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleMeetingClose}
            sx={{ color: "primary.contrastText" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMeetingSubmit}
            type="submit"
            sx={{ color: "primary.contrastText" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        TransitionComponent={transition}
        message={text}
        key={transition ? transition.name : ""}
        sx={{ backfroundColor: "primary.main", marginTop: 10, fontSize: 23 }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
      />
    </ThemeProvider >
  );
}
