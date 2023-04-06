import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import doctorReducer from "../features/doctor/doctorSlice";
import userRegisterReducer from "../features/auth/userRegisterSlice"
import userLogInReducer from '../features/auth/userLogInSlice';
import personnelListReducer from "../features/manager/personnelsSlice"
import assessmentReducer from "../features/patient/assessmentSlice"
import counselorReducer from "../features/counselor/counselorSlice";
import counselorAssignmentReducer from '../features/counselor/counselorAssignmentSlice';
import appointmentReducer from '../features/appointment/appointmentSlice';
import patientAppointmentReducer from '../features/patient/patientAppointmentSlice';
import counselorAppointmentListReducer from '../features/counselor/counselorAppointmentSlice';
import doctorAppointmentListReducer from '../features/doctor/doctorAppointmentSlice';
import reportReducer from "../features/manager/reportSlice";
import forgotPasswordReducer from '../features/auth/forgotPasswordSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    doctor: doctorReducer,
    userRegister: userRegisterReducer,
    userLogIn: userLogInReducer,
    personnelList: personnelListReducer,
    assessment: assessmentReducer,
    counselor: counselorReducer,
    counselorAssignment: counselorAssignmentReducer,
    appointment: appointmentReducer,
    patientAppointmentList: patientAppointmentReducer,
    counselorAppointmentList : counselorAppointmentListReducer,
    doctorAppointmentList : doctorAppointmentListReducer,
    report: reportReducer,
    forgotPassword: forgotPasswordReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
