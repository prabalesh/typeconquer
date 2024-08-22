import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TypingState {
    paragraph: string[];
    difficulty: "easy" | "medium" | "hard";
    includeSymbols: boolean;
    includeNumbers: boolean;
    timeLimit: number;
}

const initialState: TypingState = (() => {
    const storedTimeLimit = localStorage.getItem("ctime");
    const timeLimit =
        storedTimeLimit && !isNaN(Number(storedTimeLimit))
            ? parseInt(storedTimeLimit, 10)
            : 60;

    return {
        paragraph: [],
        difficulty: "medium",
        includeSymbols: false,
        includeNumbers: false,
        timeLimit,
    };
})();

const typingSlice = createSlice({
    name: "typing",
    initialState,
    reducers: {
        setParagraph(state, action: PayloadAction<string[]>) {
            state.paragraph = action.payload;
        },
        setDifficulty(
            state,
            action: PayloadAction<"easy" | "medium" | "hard">
        ) {
            state.difficulty = action.payload;
        },
        setIncludeSymbols(state, action: PayloadAction<boolean>) {
            state.includeSymbols = action.payload;
        },
        setIncludeNumbers(state, action: PayloadAction<boolean>) {
            state.includeNumbers = action.payload;
        },
        setTimeLimit(state, action: PayloadAction<number>) {
            state.timeLimit = action.payload;
            localStorage.setItem("ctime", action.payload.toString());
        },
    },
});

export const {
    setParagraph,
    setDifficulty,
    setIncludeSymbols,
    setIncludeNumbers,
    setTimeLimit,
} = typingSlice.actions;

export default typingSlice.reducer;
