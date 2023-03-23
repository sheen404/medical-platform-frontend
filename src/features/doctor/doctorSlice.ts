import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from "../../app/store";
import axios from "axios";
import { Patient } from "../../types/PatientDataType";

const TestPatient: Patient[] = [{
  address: "Test",
  assessmentOptionsSelected:  ["a", "b", "c", "d", "b", "c", "a", "b", "c"],
  assessmentTaken: false,
  counsellingComment: "",
  counsellingDone: false,
  counsellorAssigned: "",
  creationDate: "2000-00-00",
  dob: "2000-00-00",
  doctorAssigned: null,
  doctorComment: null,
  doctoringDone: false,
  email: "Alex@123.456",
  id: "123456",
  name: "Alex",
  otp: null,
  otpExpiryDate: null,
  password: "",
  patientQueue: null,
  phone: "",
  registrationNo: null,
  role: "",
  status: "",
  verificationAttempts: null
},
  {
    address: "Addr2",
    assessmentOptionsSelected:  [],
    assessmentTaken: false,
    counsellingComment: "",
    counsellingDone: false,
    counsellorAssigned: "",
    creationDate: "2000-00-00",
    dob: "2003-00-00",
    doctorAssigned: null,
    doctorComment: null,
    doctoringDone: false,
    email: "Rui@123.456",
    id: "888888",
    name: "Rui",
    otp: null,
    otpExpiryDate: null,
    password: "",
    patientQueue: null,
    phone: "5140000000",
    registrationNo: null,
    role: "",
    status: "",
    verificationAttempts: null

  }]

interface DoctorState {
  updatingPatientStatus: boolean;
  updateStatusError: string | null;
  patients: Patient[];
  fetchingPatients: boolean;
  fetchPatientsError: string | null;
}

const initialState: DoctorState = {
  updatingPatientStatus: false,
  updateStatusError: null,
  patients: TestPatient,
  //Todo: TestPatient change to []
  fetchingPatients: false,
  fetchPatientsError: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    updatePatientStatusRequest: (state) => {
      state.updatingPatientStatus = true;
      state.updateStatusError = null;
    },
    updatePatientStatusSuccess: (state) => {
      state.updatingPatientStatus = false;
      state.updateStatusError = null;
    },
    updatePatientStatusFail: (state, action: PayloadAction<string>) => {
      state.updatingPatientStatus = false;
      state.updateStatusError = action.payload;
    },
    fetchPatientsRequest: (state) => {
      state.fetchingPatients = true;
      state.fetchPatientsError = null;
    },
    fetchPatientsSuccess: (state, action: PayloadAction<any[]>) => {
      state.fetchingPatients = false;
      state.patients = action.payload;
      state.fetchPatientsError = null;
    },
    fetchPatientsFail: (state, action: PayloadAction<string>) => {
      state.fetchingPatients = false;
      state.fetchPatientsError = action.payload;
    },
  },
});

export const {
  updatePatientStatusRequest,
  updatePatientStatusSuccess,
  updatePatientStatusFail,
  fetchPatientsFail,
  fetchPatientsRequest,
  fetchPatientsSuccess,
} = doctorSlice.actions;



export const updatePatientStatus = (email: string, status: string, reason: string) => async (
  dispatch: AppDispatch
) => {
  dispatch(updatePatientStatusRequest());
  try {
    const response = await axios.post('/api/v1/doctor/updatePatientStatus', {
      email,
      status,
      reason,
    });
    dispatch(updatePatientStatusSuccess());
  } catch (err: any) {
    const errorMessage = err.response ? err.response.data.response : err.message;
    console.log("Update Patient Status error: " + errorMessage );
    dispatch(updatePatientStatusFail(errorMessage));
  }
};

export const fetchPatients = (email: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchPatientsRequest());
  try {
    const response = await axios.get(`/api/v1/doctor/getAllAssessPatients?email=${email}`);
    dispatch(fetchPatientsSuccess(response.data));
  } catch (err: any) {
    const errorMessage = err.response ? err.response.data.response : err.message;
    console.log("doctor fetching patient error: " + errorMessage);
    dispatch(fetchPatientsFail(errorMessage));
  }
};

export const selectDoctor = (state: RootState) => state.doctor;

export default doctorSlice.reducer;