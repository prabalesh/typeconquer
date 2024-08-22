import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
    setDifficulty,
    setIncludeNumbers,
    setIncludeSymbols,
} from "../../features/typing/typingSlice";

interface TypingOptionsProps {
    setTimeLimit: React.Dispatch<number>;
}

const TypingOptions: React.FC<TypingOptionsProps> = ({ setTimeLimit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { timeLimit, difficulty, includeNumbers, includeSymbols } =
        useSelector((state: RootState) => state.typing);
    return (
        <div className="flex flex-col gap-4 items-center mt-8">
            <div className="flex gap-4 text-gray-500">
                <button
                    onClick={() => setTimeLimit(90)}
                    className={`${
                        timeLimit === 90 ? "text-[var(--text-color)]" : ""
                    }`}
                >
                    90
                </button>
                <button
                    onClick={() => setTimeLimit(60)}
                    className={`${
                        timeLimit === 60 ? "text-[var(--text-color)]" : ""
                    }`}
                >
                    60
                </button>
                <button
                    onClick={() => setTimeLimit(30)}
                    className={`${
                        timeLimit === 30 ? "text-[var(--text-color)]" : ""
                    }`}
                >
                    30
                </button>
                <button
                    onClick={() => setTimeLimit(15)}
                    className={`${
                        timeLimit === 15 ? "text-[var(--text-color)]" : ""
                    }`}
                >
                    15
                </button>
            </div>
            <div className="flex gap-4 text-gray-500">
                <button
                    onClick={() =>
                        difficulty != "easy" && dispatch(setDifficulty("easy"))
                    }
                    className={`${
                        difficulty === "easy" ? "text-[var(--text-color)]" : ""
                    } `}
                >
                    easy
                </button>
                <button
                    onClick={() =>
                        difficulty != "medium" &&
                        dispatch(setDifficulty("medium"))
                    }
                    className={`${
                        difficulty === "medium"
                            ? "text-[var(--text-color)]"
                            : ""
                    } `}
                >
                    medium
                </button>
                <button
                    onClick={() =>
                        difficulty != "hard" && dispatch(setDifficulty("hard"))
                    }
                    className={`${
                        difficulty === "hard" ? "text-[var(--text-color)]" : ""
                    } `}
                >
                    hard
                </button>
            </div>
            <div className="flex gap-4 text-gray-500">
                <button
                    onClick={() => dispatch(setIncludeNumbers(!includeNumbers))}
                    className={`${
                        includeNumbers && "text-[var(--text-color)]"
                    } `}
                >
                    numbers
                </button>
                <button
                    onClick={() => dispatch(setIncludeSymbols(!includeSymbols))}
                    className={`${
                        includeSymbols && "text-[var(--text-color)]"
                    } `}
                >
                    symbols
                </button>
            </div>
        </div>
    );
};

export default TypingOptions;
