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
} from "@mui/material";
import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { createTheme, ThemeProvider, colors } from "@mui/material";
import { patientTheme } from "../Themes";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

export default function PatientDashboardScreen(props: any) {
  const { userInfo } = useAppSelector(selectUserLogIn);
  const navigate = useNavigate();
  const handleAppointments = () => {
    navigate(`/patient/appointments`);
  };

  return (
    <ThemeProvider theme={patientTheme}>
      <Stack padding={2} spacing={2}>
        <Typography variant="h4" color={"primary.contrastText"}>
          Good day! Dear {userInfo?.userData.name}!
        </Typography>
        <Typography variant="h5" color={"primary.contrastText"}>
          How can we help you?
        </Typography>
        {/* if the assessment is not completed */}
        {/* <Button variant="contained">Complete the assessment</Button> */}
        {/* if the assessment is completed, the patient can view the appointment schedule and decide to accept/reject it */}
        <Button
          variant="contained"
          onClick={handleAppointments}
          sx={{
            backgroundColor: "primary.dark",
            color: "primary.contrastText",
          }}
        >
          View Appointments
        </Button>
        <Divider />

        <Stack>
          <Typography variant="h5" color="primary.contrastText">
            Recent Appointments
          </Typography>
          <List>
            <ListItem>
              <Box sx={{ width: "100%" }}>
                <Card sx={{ marginTop: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row">
                        <ListItemAvatar sx={{ display: "flex" }}>
                          <Avatar alt="doctor"
                            src="/static/images/doctor/sampleDoctor.jpg"
                            sx={{ alignSelf: "center" }} />
                        </ListItemAvatar>
                        <Stack direction={"column"}>
                          <Typography>Dr. Gregory House</Typography>
                          <Typography>Date: 2023-02-12</Typography>
                        </Stack>
                      </Stack>
                      <Stack direction={"row"}>
                        <Button
                          variant="contained"
                          sx={{
                            marginRight: 2,
                            backgroundColor: "primary.dark",
                            color: "primary.contrastText",
                            ":hover": { backgroundColor: "primary.main" },
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{
                            color: "primary.contrastText",
                            borderColor: "secondary.dark",
                            ":hover": { backgroundColor: "secondary.dark" },
                          }}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
