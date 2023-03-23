import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { userLogInFail, userLogInRequest, userLogInSuccess } from "../auth/userLogInSlice";
import { UserInfo } from "../../types/UserDataType";

interface AssessmentState {
  answers: { [key: number]: string };
  currentQuestionIndex: number;
  loading: boolean,
  error: boolean,
  success: boolean,
  errorMessage: string,
  successMessage: string,

}

const initialState: AssessmentState = {
  answers: {},
  currentQuestionIndex: 0,
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
  successMessage: "",
};

export const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ index: number; answer: string }>) => {
      state.answers[action.payload.index] = action.payload.answer;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    submitRequest: (state) => {
      state.loading = true;
      state.error = false;
    },
    submitSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.successMessage = action.payload;

    },
    submitFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload;
    },

  },
});

export const submitAssessment = (questionAnswers: { email: string, assessmentOptionsSelected: string[]}) => async (dispatch: AppDispatch) => {
  dispatch(submitRequest());
  console.log(questionAnswers)
  try {
    const { data } = await axios.post(`/api/v1/patient/addAssessDetails`, questionAnswers);
    dispatch(submitSuccess(data.response));
    console.log(data.response);
    // localStorage.setItem('userData', JSON.stringify(data));
  } catch (err: any) {
    const errorMessage = err.response ? err.response.data.response : err.message
    console.log(errorMessage);
    dispatch(submitFail(errorMessage));
  }
};

export const { setAnswer, setCurrentQuestionIndex, submitRequest, submitSuccess, submitFail } = assessmentSlice.actions;
export default assessmentSlice.reducer;