import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import doctorReducer from "../features/doctor/doctorSlice";
import userRegisterReducer from "../features/auth/userRegisterSlice"
import userLogInReducer from '../features/auth/userLogInSlice';
import personnelListReducer from "../features/manager/personnelsSlice"
import assessmentReducer from "../features/patient/assessmentSlice"
// import counselorReducer from "../features/counselor/counselorSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    doctor: doctorReducer,
    userRegister: userRegisterReducer,
    userLogIn: userLogInReducer,
    personnelList: personnelListReducer,
    assessment: assessmentReducer,
    // counselor: counselorReducer,
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
