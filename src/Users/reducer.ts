import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  user: {
    _id: null,
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    following: [],
    followers: [],
    concerts: [],
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = {...initialState.user, _id: null};
    },
  },
});

export const {setUser, resetUser} = userSlice.actions;
export default userSlice.reducer;