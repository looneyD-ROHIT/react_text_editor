import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated: false,
    authenticationData: {
        uid: '',
        lastOpenedFile: {
            id: '',
            data: {}
        },
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
            if(action.payload?.uid){
                state.authenticationData.uid = action.payload.uid
            }
            if(action.payload?.lastOpenedFile?.id){
                state.authenticationData.lastOpenedFile.id = action.payload.lastOpenedFile.id
            }
            if(action.payload?.lastOpenedFile?.data?.fileName){
                state.authenticationData.lastOpenedFile.data.fileName = action.payload.lastOpenedFile.data.fileName
            }
            if(action.payload?.lastOpenedFile?.data?.fileData){
                state.authenticationData.lastOpenedFile.data.fileData = action.payload.lastOpenedFile.data.fileData
            }
            if(action.payload?.lastOpenedFile?.data?.createdAt){
                state.authenticationData.lastOpenedFile.data.createdAt = action.payload.lastOpenedFile.data.createdAt
            }
            if(action.payload?.lastOpenedFile?.data?.lastOpened){
                state.authenticationData.lastOpenedFile.data.lastOpened = action.payload.lastOpenedFile.data.lastOpened
            }
        }
    }
})


export const authActions = authSlice.actions;

export default authSlice;