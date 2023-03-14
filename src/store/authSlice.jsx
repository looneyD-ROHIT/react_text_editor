import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated: false,
    authenticationData: {
        token: '',
        filesList: [],
        totalLength: 5,
    }
}

const authSlice = createSlice({
    name: 'authdata',
    initialState,
    reducers: {
        changeAuthStatus(state, action){
            state.isAuthenticated = action.payload
        },
        changeAuthData(state, action){
            state.authenticationData = action.payload
        }
    }
})


export const authActions = authSlice.actions;

export default authSlice;