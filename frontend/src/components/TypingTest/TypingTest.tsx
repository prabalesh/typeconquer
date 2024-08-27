import TypingDisplay from "./TypingDisplay";
import TypingInput from "./TypingInput";

import React, { useRef, useState, useCallback, useEffect } from "react";
import TypingStats from "./TypingStats";
import useTimer from "../../hooks/useTimer";
import useTypingStats from "../../hooks/useTypingStats";
import useTypingState from "../../hooks/useTypingState";
import TypingOptions from "./TypingOptions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setTimeLimit } from "../../features/typing/typingSlice";

export default function TypingTest({
    handleGenerateParagraph,
}: {
    handleGenerateParagraph: () => void;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { paragraph, timeLimit } = useSelector(
        (state: RootState) => state.typing
    );

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [resetGameFlag, setResetGameFlag] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const [startTime, setStartTime] = useState<number | null>(null);

    const [
        charIndex,
        mistakes,
        isCharCorrectWrong,
        handleCharInput,
        handleBackSpace,
    ] = useTypingState();

    const [timeLeft, timesUp, setTimeLeft, setTimesUp] = useTimer(isTyping);

    const [wpm, cpm] = useTypingStats(
        charIndex,
        mistakes,
        isTyping,
        startTime,
        timeLeft
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (paragraph.length > charIndex && timeLeft !== 0) {
            if (!isTyping) {
                if (startTime === null) setStartTime(new Date().getTime());
                setIsTyping(true);
            }
            if (e.target.value.length !== charIndex + 1) {
                handleBackSpace();
                return;
            }

            const typedChar = e.target.value.slice(-1);
            const currentChar = paragraph[charIndex];

            handleCharInput(typedChar, currentChar);

            if (paragraph.length <= charIndex + 1) {
                setTimesUp(true);
                setIsTyping(false);
            }
        } else {
            setTimesUp(true);
            setIsTyping(false);
        }
    };

    const resetGame = useCallback(() => {
        setTimeLeft(timeLimit);
        setIsTyping(false);
        setStartTime(null);
        setTimesUp(false);
        inputRef.current?.focus();
        if (resetGameFlag) {
            handleGenerateParagraph();
        }
    }, [
        timeLimit,
        handleGenerateParagraph,
        setTimeLeft,
        setTimesUp,
        resetGameFlag,
    ]);

    useEffect(() => {
        resetGame();
        setResetGameFlag(false);
    }, [timeLimit, resetGame, resetGameFlag]);

    useEffect(() => {
        localStorage.setItem("ctime", timeLimit.toString());
    }, [timeLimit]);

    return (
        <div
            className={`max-w-7xl mx-auto p-4 text-footer-text flex flex-col items-center ${
                timesUp && "shake"
            }`}
        >
            <TypingInput
                handleInputChange={handleInputChange}
                inputRef={inputRef}
            />
            {paragraph.length > 0 && (
                <>
                    {timesUp ? (
                        <div className="mt-5 text-center pb-4 space-y-4 border-bottom w-full">
                            <p className="text-2xl sm:text-3xl font-semibold">
                                Time's Up
                            </p>
                            <div className="text-lg text-gray-700 dark:text-gray-300">
                                <p className="text-xl font-medium">
                                    Mistakes: <span>{mistakes}</span>
                                </p>
                                <p className="text-xl font-medium">
                                    Accuracy:{" "}
                                    <span>
                                        {(
                                            ((charIndex + 1 - mistakes) /
                                                (charIndex + 1)) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <TypingDisplay
                            charRefs={charRefs}
                            charIndex={charIndex}
                            isCharCorrectWrong={isCharCorrectWrong}
                            inputRef={inputRef}
                        />
                    )}
                </>
            )}

            <TypingStats
                timeLeft={timeLeft}
                wpm={wpm}
                cpm={cpm}
                resetGame={() => setResetGameFlag(true)}
            />
            <TypingOptions
                setTimeLimit={(newTimeLimit) => {
                    dispatch(setTimeLimit(newTimeLimit));
                    setResetGameFlag(true);
                }}
            />
        </div>
    );
}
