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
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs
} from "@mui/material";
import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { height } from "@mui/system";
import { createTheme, ThemeProvider, colors } from "@mui/material";
import { counselorTheme } from "../Themes";
import { useSelector } from "react-redux";
import { useAppSelector } from "../app/hooks";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { flexbox } from "@mui/system";
import { spacing } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { selectDoctor } from "../features/doctor/doctorSlice";
import { ansList, questions } from "./PatientAssessmentScreen";
import PatientPersonnelList from "../components/PatientPersonnelList";
import PersonnelList from "../components/PersonnelList";
import {
  selectPersonnelList,
  listAllPersonnel,
  updatePersonnel,
  listPersonnel,
  personnelUpdateMessageReset
} from "../features/manager/personnelsSlice";
import { Patient } from "../types/PatientDataType";
import { UserData } from "../types/UserDataType";

export default function CounselorDashboardScreen(props: any) {
  const { patients } = useAppSelector(selectDoctor);
  // const [patients, setPatients] = useState<Patient[]>([
  //   {
  //     id: 1,
  //     name: "Alice",
  //     selfAssessmentResults: [
  //       "Alice selfAssessmentResults",
  //       "Alice selfAssessmentResults2",
  //     ],
  //     address: "address",
  //     dob: "1998/01/01",
  //     phoneNumber: "5140000000",
  //     emailAddress: "Alice@gmail.com",
  //     doctorRegistrationNumber: "88888888",
  //   },
  //   {
  //     id: 2,
  //     name: "Ben",
  //     selfAssessmentResults: [
  //       "Ben selfAssessmentResults",
  //       "Ben selfAssessmentResults2",
  //     ],
  //     address: "address2",
  //     dob: "1998/01/02",
  //     phoneNumber: "5140000001",
  //     emailAddress: "Ben@gmail.com",
  //     doctorRegistrationNumber: "77777777",
  //   },
  //   {
  //     id: 3,
  //     name: "Alex",
  //     selfAssessmentResults: [
  //       "Alex selfAssessmentResults",
  //       "Alex selfAssessmentResults2",
  //     ],
  //     address: "address3",
  //     dob: "1998/01/03",
  //     phoneNumber: "5140000002",
  //     emailAddress: "Alex@gmail.com",
  //     doctorRegistrationNumber: "99999999",
  //   },
  // ]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const personnelList = useAppSelector(selectPersonnelList);

  // type Patient = {
  //   id: number;
  //   name: string;
  //   selfAssessmentResults: string[];
  //   address: string;
  //   dob: string;
  //   phoneNumber: string;
  //   emailAddress: string;
  //   doctorRegistrationNumber: string;
  // };
  //const handleAssessmentButtonClick = (patient: Patient) => {
  //  setSelectedPatient(patient);
  //  setShowAssessmentDialog(true);
  //};
  const [selectedPerson, setSelectedPerson] = useState<UserData | null>(null);
  const handleAssessmentButtonClick = (person: UserData) => {
    setSelectedPerson(person);
    setShowAssessmentDialog(true);
  };
  const handleAccept = (person: UserData) => {
    navigate(`/counselor/assignment?patientId=${person.id}`)
  }
  const handleClose = () => {
    setShowAssessmentDialog(false);
    // setShowDetailDialog((false));
  };
  const navigate = useNavigate();
  const handleAppointments = () => {
    navigate(`/counselor/appointments`);
  };
  const handleReject = (person: UserData) => {
    setSelectedPerson(person);
  }

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (
    event: any,
    newTabIndex: React.SetStateAction<number>
  ) => {
    setTabIndex(newTabIndex);
  };

  const { userInfo } = useAppSelector(selectUserLogIn);

  return (
    <ThemeProvider theme={counselorTheme}>
      <Box>
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
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            ":hover": { backgroundColor: "primary.light" },
          }}
        >
          View Appointments
        </Button>

        <Divider />


        <Grid container direction="row">
          <Grid item container md={12} direction="column">
            <Typography variant="h5" color={"primary.contrastText"} margin="1rem">
              Patient List
            </Typography>
            </Grid>
            </Grid>
            </Stack>
      </Box>
      <Box>
        <Box>
        </Box>
        <Box>
          <Box>
              <Box>
                {personnelList.personnel && (
                  <PatientPersonnelList
                    users={personnelList.personnel.patients}
                    handleAssessmentButtonClick={handleAssessmentButtonClick}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                  />
                )}
              </Box>
          </Box>
        </Box>
      </Box>
      <Dialog open={showAssessmentDialog} onClose={handleClose}>
          <DialogTitle sx={{ fontWeight: "bold", fontSize: 30 }}>
            {selectedPerson?.name} Self-Assessment Results
          </DialogTitle>
          <DialogContent>
            <Stack direction={"row"} justifyContent={"space-around"}>
              <Typography variant="subtitle1">
                ID: {selectedPerson?.id}
              </Typography>
              <Typography variant="subtitle1">
                Name: {selectedPerson?.name}
              </Typography> </Stack>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>

            </Typography>
            <Stack spacing={2} pt={1}>
              {questions.map((question) => (
                <Paper key={question.id} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{question.text}</Typography>
                  <Typography
                    variant="body1">{`${selectedPerson && selectedPerson.assessmentOptionsSelected[question.id - 1] ?
                      ansList[selectedPerson.assessmentOptionsSelected[question.id - 1].charCodeAt(0) - 97] : "N/A"
                      }`}</Typography>
                </Paper>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>
    </ThemeProvider>
  );
}