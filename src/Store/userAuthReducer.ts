import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  userAuth: {
    _id: null,
    token: null,
  }
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserAuth: (state, action) => {
      state.userAuth = action.payload;
    },
    resetUserAuth: (state) => {
      state.userAuth = {...initialState.userAuth};
    },
  },
});

export const {setUserAuth, resetUserAuth} = userAuthSlice.actions;
export default userAuthSlice.reducer;