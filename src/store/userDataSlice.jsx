import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentFileName: 'Untitled-1',
    currentFileContent: '',
}

const userDataSlice = createSlice({
    name: 'userdata',
    initialState,
    reducers: {
        changeFileName(state, action){
            state.currentFileName = action.payload
        },
        changeFileContent(state, action){
            state.currentFileContent = action.payload
        }
    }
})


export const userDataActions = userDataSlice.actions;

export default userDataSlice;