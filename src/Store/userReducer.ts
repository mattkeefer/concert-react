import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  user: {
    _id: null,
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    following: [],
    followers: [],
    savedConcerts: [],
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