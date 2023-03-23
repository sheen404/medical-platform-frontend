import { Avatar, Box, Button, Card, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";
import SelfAssessmentForm from "../components/SelfAssessmentForm";
import timeslots from "../constants/Timeslots";

export default function CounselorModifyAppointmentScreen() {

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
			<Grid id="main-grid" container direction="column" spacing={3}>

				<Grid item container id="date-timeslot-picker-grid">
					<Grid item container direction="column" id="date-picker" spacing={2} md={12} lg={8}>
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
					<Button onClick={handleClose}>Close</Button>
					<Button onClick={handleSubmit}>Submit</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}