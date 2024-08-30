import TypingDisplay from "./TypingDisplay";
import TypingInput from "./TypingInput";

import { useRef, useState, useCallback, useEffect } from "react";
import TypingStats from "./TypingStats";
import useTimer from "../../hooks/useTimer";
import useTypingStats from "../../hooks/useTypingStats";
import useTypingState from "../../hooks/useTypingState";
import TypingOptions from "./TypingOptions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setTimeLimit } from "../../features/typing/typingSlice";
import LowAccurarcyWarning from "./LowAccuracuWarning";
import CongratsModal from "../CongratsModal";
import TypingTestSummary from "./TypingTestSummary";

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

    const [practiceWords, setPracticeWords] = useState<string[]>([]);

    const [bestWpm, setBestWpm] = useState<number>(0);

    const [modalOpen, setModalOpen] = useState(true); // for congrats modal

    const {
        charIndex,
        mistakes,
        isCharCorrectWrong,
        handleCharInput,
        handleBackSpace,
        maxCharIndex,
        errorPoints,
        highMistakeAlert,
        handleCtrlBackspace,
    } = useTypingState();

    const [timeLeft, timesUp, setTimeLeft, setTimesUp, setPauseTime] =
        useTimer(isTyping);

    const [wpm, cpm] = useTypingStats(
        charIndex,
        mistakes,
        isTyping,
        startTime,
        timeLeft
    );

    const handleInputChange = useCallback(
        (key: string, ctrlKey: boolean) => {
            // Check for specific keys like Backspace
            if (isTyping && key === "Backspace") {
                if (ctrlKey) {
                    console.log("Ctrl + Backspace");
                    handleCtrlBackspace();
                } else {
                    handleBackSpace();
                }
            }
            // Handle valid alphanumeric and symbol inputs
            else if (
                !ctrlKey &&
                /^[a-zA-Z0-9 `~!@#$%^&*()-_=+[\]{};:'",.<>?/\\|]$/.test(key)
            ) {
                if (ctrlKey) return;
                console.log(
                    `Key: ${key}, Match: ${key === paragraph[charIndex]}`
                );
                if (
                    paragraph.length > charIndex &&
                    timeLeft !== 0 &&
                    !timesUp
                ) {
                    if (!isTyping) {
                        if (startTime === null)
                            setStartTime(new Date().getTime());
                        setIsTyping(true);
                    }
                    if (charIndex >= paragraph.length) setTimesUp(true);
                    handleCharInput(key, paragraph[charIndex]);

                    if (paragraph.length <= charIndex + 1) {
                        setTimesUp(true);
                        setIsTyping(false);
                    }
                } else {
                    setTimesUp(true);
                    setIsTyping(false);
                }
            }
        },
        [
            charIndex,
            handleBackSpace,
            handleCharInput,
            handleCtrlBackspace,
            isTyping,
            paragraph,
            setTimesUp,
            startTime,
            timeLeft,
            timesUp,
        ]
    );

    useEffect(() => {
        const inputElement = inputRef.current;

        if (inputElement) {
            const handleKeyDown = (e: KeyboardEvent) => {
                handleInputChange(e.key, e.ctrlKey);
                // Blur input on Escape
                if (e.key === "Escape") {
                    inputElement.blur();
                }
            };

            inputElement.addEventListener("keydown", handleKeyDown);

            return () => {
                inputElement.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [
        inputRef,
        paragraph,
        charIndex,
        handleCharInput,
        handleCtrlBackspace,
        handleBackSpace,
        handleInputChange,
    ]);

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

    const findPracticeWords = useCallback(() => {
        const content = paragraph.slice(0, maxCharIndex + 1).join("");
        const points = [...errorPoints];

        const words = content.split(" ");

        const filteredWords = words.filter((word, wordIndex) => {
            const startIdx = content.indexOf(
                word,
                wordIndex === 0
                    ? 0
                    : content.indexOf(words[wordIndex - 1]) +
                          words[wordIndex - 1].length +
                          1
            );
            return points.some(
                (point) => point >= startIdx && point < startIdx + word.length
            );
        });

        setPracticeWords(filteredWords);
    }, [errorPoints, maxCharIndex, paragraph]);

    const fetchBestResult = useCallback(async () => {
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
        }
    }, []);

    const submitResult = useCallback(async () => {
        if (!user.id) return;
        if (highMistakeAlert) return;

        const apiURL = import.meta.env.VITE_API_URL;
        const accuracy = (
            ((charIndex + 1 - mistakes) / (charIndex + 1)) *
            100
        ).toFixed(2);
        await fetch(`${apiURL}/api/typingtests/result`, {
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
        resetGame();
        setResetGameFlag(false);
    }, [timeLimit, resetGame, resetGameFlag]);

    useEffect(() => {
        localStorage.setItem("ctime", timeLimit.toString());
    }, [timeLimit]);

    useEffect(() => {
        if (timesUp) {
            submitResult();
            findPracticeWords();
        }
    }, [timesUp, findPracticeWords, submitResult]);

    useEffect(() => {
        if (isTyping && user.id) {
            fetchBestResult();
        }
    }, [fetchBestResult, isTyping, user.id]);

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
            <TypingInput inputRef={inputRef} />
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
                                <CongratsModal
                                    isOpen={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                    wpm={wpm}
                                    prevBestWpm={bestWpm}
                                />
                            </>
                        )}
                    {timesUp ? (
                        <TypingTestSummary
                            mistakes={mistakes}
                            accuracy={(
                                ((charIndex + 1 - mistakes) / (charIndex + 1)) *
                                100
                            ).toFixed(2)}
                            errorPoints={errorPoints}
                            practiceWords={practiceWords}
                        />
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
            <div className="my-4">
                <p className="text-sm">
                    <span
                        className="bg-[var(--button-hover)] text-[var(--button-hover-text)] rounded px-1 inline-block text-center"
                        style={{ width: "50px" }}
                    >
                        esc
                    </span>{" "}
                    - unfocus
                </p>
            </div>
        </div>
    );
}
