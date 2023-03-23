import React, { useState, useEffect } from "react";
import { Grid, Typography, Chip, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio, Card, CardContent, Avatar, CardActions, Button, Box, Stepper, Step, StepLabel, Paper, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { DatePickerToolbar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import timeslots from "../constants/Timeslots";
import { UserData } from "../types/UserDataType";
import { display, style } from "@mui/system";
import SelfAssessmentForm from "../components/SelfAssessmentForm";
import { useAppSelector } from "../app/hooks";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { roleToPosition } from "../constants/PositionRoleMap";
import { useNavigate } from "react-router";


export default function CounselorAssignmentScreen() {

	const navigate = useNavigate();
	const userLogIn = useAppSelector(selectUserLogIn);

	const [value, setValue] = useState("");
	const [activeStep, setActiveStep] = useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
	};

	const experts = [
		userLogIn.userInfo ? { name: userLogIn.userInfo?.userData.name, role: roleToPosition.get(userLogIn.userInfo?.userData.role) } : { name: "Myself", role: "counselor" },
		{ name: 'John Doe', role: 'Cardiologist' },
		{ name: 'Jane Doe', role: 'Neurologist' },
		{ name: 'Bob Smith', role: 'Dermatologist' },
		{ name: 'Alice Smith', role: 'Pediatrician' },
		{ name: 'Mike Johnson', role: 'Oncologist' },
		{ name: 'Sara Johnson', role: 'Psychiatrist' },
	];
	const patient: UserData = {
		id: "patientId",
		email: "patient@front.end",
		role: "ROLE_PATIENT",
		name: "Patient Name",
		address: "142 Rue Wellington S",
		dob: "2000-01-01",
		phone: "8199933118",
		registrationNo: null,
		status: "VERIFIED",
  		password: "tests@555",
  		assessmentTaken: true,
  		assessmentOptionsSelected: [""],
  		verificationAttempts: 0,
  		otpExpiryDate: "",
  		patientQueue: "",
  		counsellorAssigned: "",
  		doctorAssigned: "",
  		counsellingDone: false,
  		counsellingComment: "",
  		doctoringDone: false,
  		doctorComment: "",
  		creationDate: "",
  		otp: ""
	}

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [comment, setComment] = React.useState("");

	const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setComment(event.target.value);
	};

	const handleSubmit = (event: React.MouseEvent) => {
		event.preventDefault();
	}

	return (
		<Box>
			{/* <Stepper activeStep={activeStep} sx={{ marginBottom: 2 }}>
				<Step>
					<StepLabel>Check Patient Self Assessment Form</StepLabel>
				</Step>
				<Step>
					<StepLabel>Select an Expert</StepLabel>
				</Step>
				<Step>
					<StepLabel>Finish with a Comment</StepLabel>
				</Step>
			</Stepper> */}
			<Grid container spacing={4} padding={1}>
				<Grid id="main-grid" container item direction="column" md={8} sm={12} spacing={3}>

					<Grid item
						container
						id="patient-self-assessment-grid"
						direction="column"
						spacing={2}
					>
						<Grid item>
							<Typography variant="h4">Patient Self Asssessment Form</Typography>
						</Grid>
						<Grid item >
							<SelfAssessmentForm />
						</Grid>
					</Grid>
					{/* <Grid item container id="date-timeslot-picker-grid"> */}
					{/* <Grid item container direction="column" id="date-picker" spacing={2} md={12} lg={8}>
							<Grid item>
								<Typography variant="h4">Date Picker</Typography>
							</Grid>
							<Grid item>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<StaticDatePicker orientation="landscape" disablePast
										slotProps={{
											actionBar: {
												actions: undefined
											}
										}}
									/>
								</LocalizationProvider>
							</Grid>

						</Grid>
						<Grid item container direction="column" spacing={2} id="timeslot-picker" lg={4} md={12}>
							<Grid item>
								<Typography variant="h4">Timeslot Picker</Typography>
							</Grid>
							<Grid item>
								<FormControl>
									<RadioGroup
										aria-labelledby="demo-controlled-radio-buttons-group"
										name="controlled-radio-buttons-group"
										value={value}
										onChange={handleChange}
										row
									>
										{timeslots.map((entry) =>
											<FormControlLabel sx={{ width: "9rem" }} key={entry} value={entry} control={<Radio />} label={entry} />
										)}
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid> */}
					{/* </Grid> */}
					<Grid item container direction="column" id="expert-picker" spacing={2}>
						<Grid item>
							<Typography variant="h4">Expert Picker</Typography>
						</Grid>

						<Grid item container spacing={3}>
							{experts.map((expert) => (
								<Grid item xs={12} sm={6} xl={4} key={expert.name}>
									<Card
										sx={{ minHeight: "5rem", minWidth: "16rem" }}
									>
										<Box display="flex" flexDirection="row" padding={2}>
											<Box display="flex" alignItems="center" >
												<Avatar>{expert.name.charAt(0)}</Avatar>
											</Box>
											<Box flexGrow={1} marginLeft={2}>
												<Typography variant="h5" component="h2">
													{expert.name}
												</Typography>
												<Typography color="textSecondary">{expert.role}</Typography>
											</Box>
											<Box>
												<CardActions>
													<Button variant="contained" color="primary">
														Select
													</Button>
												</CardActions>
											</Box>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
				<Grid id="profile-grid" item container md={4} direction="column" spacing={3}>
					<Grid id="patient-details" item container spacing={2} direction="column">
						<Grid item>
							<Typography variant="h4">Patient Details</Typography>
						</Grid>
						<Grid item>
							<Paper sx={{ p: 3, paddingTop: 1, display: "flex", flexDirection: "column" }}>
								<Box display="flex" alignItems="center" justifyContent="flex-start" >
									<Avatar>{patient.name.charAt(0)}</Avatar>
									<Typography variant="h5" margin={3}>{patient.name}</Typography>
								</Box>
								<Stack spacing={1}>
									<Typography>ID: {patient.id}</Typography>
									<Typography>Email: {patient.email}</Typography>
									<Typography>Role: {patient.role}</Typography>
									<Typography>Address: {patient.address}</Typography>
									<Typography>Date of Birth: {patient.dob}</Typography>
									<Typography>Phone: {patient.phone}</Typography>
									<Typography>Status: {patient.status}</Typography>
								</Stack>
							</Paper>
						</Grid>
					</Grid>
					<Grid id="expert-details" item container spacing={2} direction="column">
						<Grid item>
							<Typography variant="h4">Expert Details</Typography>
						</Grid>
						<Grid item>
							<Paper sx={{ p: 3, paddingTop: 1, display: "flex", flexDirection: "column" }}>
								<Box display="flex" alignItems="center" justifyContent="flex-start" >
									<Avatar>{patient.name.charAt(0)}</Avatar>
									<Typography variant="h5" margin={3}>{patient.name}</Typography>
								</Box>
								<Stack spacing={1}>
									<Typography>ID: {patient.id}</Typography>
									<Typography>Email: {patient.email}</Typography>
									<Typography>Role: {patient.role}</Typography>
									<Typography>Address: {patient.address}</Typography>
									<Typography>Date of Birth: {patient.dob}</Typography>
									<Typography>Phone: {patient.phone}</Typography>
									<Typography>Status: {patient.status}</Typography>
								</Stack>
							</Paper>
						</Grid>
						<Grid item container>
							<Button variant="outlined" color="secondary" sx={{ flexGrow: 1, marginRight: "1rem" }}
								onClick={() => { navigate("../") }}
							>Back</Button>
							<Button
								// disabled
								variant="contained" sx={{ flexGrow: 1, marginLeft: "1rem" }} onClick={handleClickOpen}>Assign</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>


			<Dialog
				open={open}
				onClose={handleClose}
			>
				<DialogTitle>Finish with a comment</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Leave a comment for assigning the patient.
					</DialogContentText>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: 'fit-content',
						}}
					>
						<TextField
							id="outlined-multiline-flexible"
							label="Counselor's comment"
							placeholder="Please enter your comment..."
							required
							multiline
							maxRows={6}
							value={comment}
							onChange={handleCommentChange}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" color="secondary" onClick={handleClose}>Close</Button>
					<Button variant="contained" onClick={handleSubmit}>Submit</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}