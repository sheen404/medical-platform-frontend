import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { UserData, UserInfo} from '../../types/UserDataType';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { AppDispatch} from '../../app/store';

const initialState: UserUpdateState = {
  userInfo: null,
	loading: false,
	error: false,
	errorMessage: ""
};

export type UserUpdateState = {
	userInfo: UserInfo | null
	loading: boolean,
	error: boolean,
	errorMessage: string,
}

const userUpdateSlice = createSlice({
  name: 'userUpdate',
  initialState,
  reducers: {
    userUpdateRequest: (state) => {
      state.loading = true;
    },
    userUpdateSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = false;
    },
    userUpdateFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
			state.error = true;
      state.errorMessage = action.payload;
    },
    //userLogOut: (state) => {
    //  state.userInfo = null;
    //},
  },
});

export const {
  userUpdateFail, userUpdateRequest, userUpdateSuccess,
} = userUpdateSlice.actions;

export const selectUserUpdate = (state: RootState) => state.userUpdate;

export const update = (email: string, name: string, dob: string, phoneNumber: string, address: string, registrationNumber: string | undefined) => async (dispatch: AppDispatch) => {
  dispatch(userUpdateRequest());
  try {
    const { data } = await axios.post('/api/v1/editProfile', { email, name, dob, phoneNumber, address, registrationNumber});
    console.log(data);
    dispatch(userUpdateSuccess(data));
    // localStorage.setItem('userData', JSON.stringify(data));
  } catch (err: any) {
    const errorMessage = err.response ? err.response.data.response : err.message
    console.log(errorMessage);
    dispatch(userUpdateFail(errorMessage));
  }
};
//export const logOut = () => (dispatch: AppDispatch) => {
  // localStorage.removeItem('userData');
////  dispatch(userLogOut());
//};

export default userUpdateSlice.reducer;