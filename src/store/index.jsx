import { configureStore } from "@reduxjs/toolkit";

import userDataSlice from "./userDataSlice";

import authSlice from "./authSlice";


const store = configureStore({
    reducer: {
        user: userDataSlice.reducer,
        auth: authSlice.reducer
    }
})


export default store;