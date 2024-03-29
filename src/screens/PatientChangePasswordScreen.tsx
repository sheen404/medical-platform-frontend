import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { createTheme, ThemeProvider, colors } from "@mui/material";
import { patientTheme } from "../Themes";
import { selectUserLogIn } from "../features/auth/userLogInSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ReduxSnackbar from "../components/ReduxSnackbar";
import {
  closeSnackbar,
  newError,
  requestOtp,
  resetPassword,
  selectForgotPassword,
} from "../features/auth/forgotPasswordSlice";
import { useNavigate } from "react-router";

export default function PatientChangePasswordScreen(props: any) {
  const { userInfo } = useAppSelector(selectUserLogIn);
  const navigate = useNavigate();

  const [email, setEmail] = useState(userInfo ? userInfo.userData.email : "");
  // const [password, setPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [otp, setOtp] = useState("");

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userInfo) {
      if (newPassword1 === newPassword2 && newPassword1.length >= 8) {
        dispatch(resetPassword(userInfo.token, email, otp, newPassword1));
      } else {
        dispatch(newError("Passwords do not match or are too short"));
      }
    }
  };

  const handleResend = (e: FormEvent) => {
    e.preventDefault();
    if (userInfo) {
      dispatch(requestOtp(userInfo.token, email));
    }
  };

  const forgotPassoword = useAppSelector(selectForgotPassword);

  useEffect(() => {
    if (forgotPassoword.finalSuccess === true) {
      console.log("logout timer started");
      setTimeout(() => navigate("/signout"), 3000);
    }
  }, [forgotPassoword.finalSuccess]);

  return (
    <ThemeProvider theme={patientTheme}>
      <Box>
        <Container>
          <form onSubmit={handleSubmit}>
            <Stack spacing={5} padding={5}>
              <Typography variant="h4" color={"primary.contrastText"}>
                Change Password
              </Typography>
              <TextField
                id="email-field"
                label="E-mail"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled
                color="secondary"
              />
              <TextField
                id="new-password-field-1"
                label="New Password"
                variant="outlined"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                type="password"
                required
                color="secondary"
              />
              <TextField
                id="new-password-field-2"
                label="Confirm New Password"
                variant="outlined"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                type="password"
                required
                color="secondary"
              />
              <TextField
                id="otp-field"
                label="OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                color="secondary"
              />
              <Stack
                direction="row"
                spacing={5}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Discard
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleResend}
                  sx={{
                    backgroundColor: "primary.dark",
                    ":hover": { backgroundColor: "primary.main" },
                  }}
                >
                  Request OTP
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: "primary.dark",
                    ":hover": { backgroundColor: "primary.main" },
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </Container>
        <ReduxSnackbar
          show={forgotPassoword.showSnackbar}
          loading={forgotPassoword.loading}
          success={forgotPassoword.success}
          error={forgotPassoword.error}
          message={forgotPassoword.message}
          onClose={() => dispatch(closeSnackbar())}
          autoHideDuration={5000}
        />
      </Box>
    </ThemeProvider>
  );
}
