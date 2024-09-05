import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    username: string | null;
    name: string | null;
}

const initialState: UserState = {
    id: null,
    username: null,
    name: null,
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            return { ...state, ...action.payload };
        },
        clearUser() {
            return initialState;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
