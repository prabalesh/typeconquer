import { createSlice } from "@reduxjs/toolkit";

interface SiderbarState {
    isSidebarOpen: boolean;
}

const initialState: SiderbarState = {
    isSidebarOpen: false,
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState: initialState,
    reducers: {
        siderbarOpen(state) {
            state.isSidebarOpen = true;
        },
        siderbarClose(state) {
            state.isSidebarOpen = false;
        },
    },
});

export const { siderbarOpen, siderbarClose } = sidebarSlice.actions;
export default sidebarSlice.reducer;
