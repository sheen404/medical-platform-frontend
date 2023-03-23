import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { Patient } from "../../types/PatientDataType";

interface CounselorState {
  updatingPatientStatus: boolean;
  updateStatusError: string | null;
  patients: Patient[];
  fetchingPatients: boolean;
  fetchPatientsError: string | null;
}

const initialState: CounselorState = {
  updatingPatientStatus: false,
  updateStatusError: null,
  patients: [],
  fetchingPatients: false,
  fetchPatientsError: null,
};

const counselorSlice = createSlice({
  name: 'counselor',
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
} = counselorSlice.actions;



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
    dispatch(fetchPatientsFail(errorMessage));
  }
};

export default counselorSlice.reducer;