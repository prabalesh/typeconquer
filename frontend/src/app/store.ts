import { configureStore } from "@reduxjs/toolkit";

import typingReducer from "../features/typing/typingSlice";
import userReducer from "../features/user/userSlice";
import siderbarReducer from "../features/sidebar/sidebarsSice";

const store = configureStore({
    reducer: {
        user: userReducer,
        typing: typingReducer,
        sidebar: siderbarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
