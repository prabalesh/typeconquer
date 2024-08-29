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
import LowAccurarcyWarning from "./LowAccuracuWarning";

const CongratsModal = ({
    isOpen,
    onClose,
    wpm,
    prevBestWpm,
}: {
    isOpen: boolean;
    onClose: () => void;
    wpm: number;
    prevBestWpm: number;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity- z-50">
            <div className="p-8 rounded-lg shadow-lg text-center animated-border shake bg-[var(--bg-color)]">
                <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                <p className="text-lg">
                    You've achieved the best WPM of {wpm}!
                </p>
                <p>Previous best: {prevBestWpm} wpm</p>
                <button
                    className="my-4 py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default function TypingTest({
    handleGenerateParagraph,
}: {
    handleGenerateParagraph: () => void;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { paragraph, timeLimit } = useSelector(
        (state: RootState) => state.typing
    );
    const user = useSelector((state: RootState) => state.user);

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
        maxCharIndex,
        errorPoints,
        highMistakeAlert,
    ] = useTypingState();

    const [timeLeft, timesUp, setTimeLeft, setTimesUp, setPauseTime] =
        useTimer(isTyping);

    const [wpm, cpm] = useTypingStats(
        charIndex,
        mistakes,
        isTyping,
        startTime,
        timeLeft
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (paragraph.length > charIndex && timeLeft !== 0 && !timesUp) {
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

    const [practiceWords, setPracticeWords] = useState<string[]>([]);

    const findPracticeWords = useCallback(() => {
        const content = paragraph.slice(0, maxCharIndex + 1).join("");
        const points = [...errorPoints];

        // Split the content into words
        const words = content.split(" ");

        // Filter words based on error points
        const filteredWords = words.filter((word, wordIndex) => {
            // Calculate the start index of the current word
            const startIdx = content.indexOf(
                word,
                wordIndex === 0
                    ? 0
                    : content.indexOf(words[wordIndex - 1]) +
                          words[wordIndex - 1].length +
                          1
            );

            // Check if any error point falls within the word's range
            return points.some(
                (point) => point >= startIdx && point < startIdx + word.length
            );
        });

        // Update state with the filtered words
        setPracticeWords(filteredWords);
    }, [errorPoints, maxCharIndex, paragraph]);

    const submitResult = useCallback(async () => {
        if (!user.id) return;
        if (highMistakeAlert) return;

        const apiURL = import.meta.env.VITE_API_URL;
        const accuracy = (
            ((charIndex + 1 - mistakes) / (charIndex + 1)) *
            100
        ).toFixed(2);
        const res = await fetch(`${apiURL}/api/typingtests/result`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accuracy,
                wpm,
                duration: timeLimit,
                errorPoints: [...errorPoints],
                text: paragraph.slice(0, maxCharIndex + 1).join(""),
            }),
        });
        if (res.ok) {
            console.log("Okay");
        }
    }, [
        charIndex,
        errorPoints,
        highMistakeAlert,
        maxCharIndex,
        mistakes,
        paragraph,
        timeLimit,
        user.id,
        wpm,
    ]);

    useEffect(() => {
        if (timesUp) {
            submitResult();
            findPracticeWords();
        }
    }, [timesUp, findPracticeWords, submitResult]);

    const [bestWpm, setBestWpm] = useState<number>(0);

    const fetchBestResult = useCallback(async () => {
        console.log("working");
        const apiURL = `${
            import.meta.env.VITE_API_URL
        }/api/typingtests/bestresult`;
        const res = await fetch(apiURL, {
            method: "GET",
            credentials: "include",
        });

        if (res.ok) {
            const data = await res.json();
            if (typeof data === "object" && "bestWPM" in data) {
                if (typeof data["bestWPM"] === "number") {
                    setBestWpm(data["bestWPM"]);
                }
            }
        } else {
            console.log("error");
        }
    }, []);

    useEffect(() => {
        if (isTyping && user.id) {
            fetchBestResult();
        }
    }, [fetchBestResult, isTyping, user.id]);

    const createConfetti = () => {
        const confettiContainer = document.createElement("div");
        confettiContainer.classList.add("confetti");
        document.body.appendChild(confettiContainer);

        const colors = ["#FF5733", "#33FF57", "#3357FF", "#F0F0F0"];

        for (let i = 0; i < 100; i++) {
            const confettiPiece = document.createElement("div");
            confettiPiece.classList.add("confetti-piece");
            confettiPiece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            confettiPiece.style.width = `${Math.random() * 10 + 5}px`;
            confettiPiece.style.height = `${Math.random() * 10 + 5}px`;
            confettiPiece.style.top = `${Math.random() * 100}vh`;
            confettiPiece.style.left = `${Math.random() * 100}vw`;
            confettiPiece.style.animationDuration = `${Math.random() * 2 + 3}s`;
            confettiContainer.appendChild(confettiPiece);
        }

        // Remove confetti container after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    };

    const [modalOpen, setModalOpen] = useState(true);

    useEffect(() => {
        if (highMistakeAlert) {
            setTimesUp(true);
            setIsTyping(false);
            inputRef.current?.blur();
            setPauseTime(true);
            setIsTyping(false);
        }
    }, [highMistakeAlert, setPauseTime, setTimesUp]);

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
            {highMistakeAlert && (
                <LowAccurarcyWarning
                    resetGame={() => setResetGameFlag(true)}
                    accuracy={(
                        ((charIndex + 1 - mistakes) / (charIndex + 1)) *
                        100
                    ).toFixed(2)}
                />
            )}
            {paragraph.length > 0 && (
                <>
                    {timesUp &&
                        user.id &&
                        bestWpm != 0 &&
                        !highMistakeAlert &&
                        bestWpm < wpm && (
                            <>
                                {createConfetti()}
                                <CongratsModal
                                    isOpen={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                    wpm={wpm}
                                    prevBestWpm={bestWpm}
                                />
                            </>
                        )}
                    {timesUp ? (
                        <div className="mt-5 text-center pb-4 space-y-4 bordered rounded-xl p-4 sm:p-8 w-full max-w-4xl mx-auto">
                            <p className="text-2xl sm:text-3xl font-semibold pb-2 border-bottom">
                                Time's Up
                            </p>
                            <div className="text-lg text-gray-500 space-y-4">
                                <p className="text-xl font-medium">
                                    <span>Mistakes:</span>{" "}
                                    <span>{mistakes}</span>
                                </p>
                                <p className="text-xl font-medium">
                                    <span>Accuracy: </span>
                                    <span>
                                        {(
                                            ((charIndex + 1 - mistakes) /
                                                (charIndex + 1)) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </span>
                                </p>

                                {errorPoints.size > 0 && (
                                    <p className="text-xl font-medium">
                                        <span>Mistaken characters: </span>
                                        {[...errorPoints]
                                            .slice(0, 10)
                                            .map((errorPoint, i) => (
                                                <span key={i}>
                                                    {paragraph[errorPoint]}
                                                    {i !== 9 && ", "}
                                                </span>
                                            ))}
                                        {errorPoints.size > 10 && (
                                            <span>
                                                +{errorPoints.size - 10} more
                                                characters
                                            </span>
                                        )}
                                    </p>
                                )}

                                {practiceWords.length > 0 && (
                                    <div>
                                        <p className="text-xl font-medium my-2">
                                            Practice words:{" "}
                                        </p>
                                        <div className="flex flex-wrap justify-center py-2">
                                            {practiceWords
                                                .slice(0, 4)
                                                .map((word, wordIndex) => (
                                                    <div
                                                        key={wordIndex}
                                                        className="inline-block bordered py-2 px-4 sm:px-8 rounded-3xl m-1"
                                                    >
                                                        {word}
                                                    </div>
                                                ))}
                                            {practiceWords.length > 4 && (
                                                <div className="inline-block py-2 m-1">
                                                    +{practiceWords.length - 4}{" "}
                                                    more words
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
