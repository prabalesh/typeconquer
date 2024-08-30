import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

import useTimer from "./useTimer";
import useTypingStats from "./useTypingStats";

const useTypingState = (
    inputRef: React.RefObject<HTMLInputElement>,
    timeLimit: number
) => {
    const { paragraph } = useSelector((state: RootState) => state.typing);

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    const [charIndex, setCharIndex] = useState<number>(0);
    const [charIndexAfterSpace, setCharIndexAfterSpace] = useState<number>(0);
    const [maxCharIndex, setMaxCharIndex] = useState<number>(0);

    const [mistakes, setMistakes] = useState<number>(0);
    const [highMistakeAlert, setHighMistakeAlert] = useState<boolean>(false);

    const [isCharCorrectWrong, setIsCharCorrectWrong] = useState<string[]>([]);

    const [errorPoints, setErrorPoints] = useState<Set<number>>(new Set());
    const [practiceWords, setPracticeWords] = useState<string[]>([]);

    const [timeLeft, timesUp, setTimeLeft, setTimesUp, setPauseTime] = useTimer(
        isTyping,
        timeLimit
    );
    const [wpm, cpm] = useTypingStats(
        charIndex,
        mistakes,
        isTyping,
        startTime,
        timeLeft
    );

    const checkHighMistakes = useCallback(() => {
        if (charIndex > 120 && mistakes > charIndex * 0.6) {
            setHighMistakeAlert(true);
        }
    }, [charIndex, mistakes]);

    const handleCtrlBackspace = useCallback(() => {
        if (charIndex != charIndexAfterSpace) {
            setIsCharCorrectWrong((prevState) => {
                for (let i = charIndexAfterSpace; i < charIndex; i++) {
                    prevState[i] = "";
                }
                return prevState;
            });
            setCharIndex(charIndexAfterSpace);
        }
    }, [charIndex, charIndexAfterSpace]);

    // handling backspace
    const handleBackSpace = useCallback(() => {
        setCharIndex((prevCharIndex) => {
            setIsCharCorrectWrong((prevState) => {
                const newState = [...prevState];
                if (
                    newState[prevCharIndex - 1] == "text-red-500" ||
                    newState[prevCharIndex - 1] == "bg-red-500"
                ) {
                    setMistakes((prevMistakes) =>
                        prevMistakes - 1 < 0 ? 0 : prevMistakes - 1
                    );
                }
                newState[prevCharIndex - 1] = "";
                return newState;
            });
            return Math.max(prevCharIndex - 1, 0);
        });
    }, []);

    // validating input
    const handleCharInput = useCallback(
        (typedChar: string, currentChar: string) => {
            if (typedChar == currentChar) {
                setIsCharCorrectWrong((prevState) => {
                    const newState = [...prevState];
                    newState[charIndex] = "text-green-500";
                    return newState;
                });
            } else {
                setMistakes((prevMistakes) => prevMistakes + 1);
                setIsCharCorrectWrong((prevState) => {
                    const newState = [...prevState];
                    if (!errorPoints.has(charIndex) && currentChar != " ") {
                        setErrorPoints((prevErrorPoints) => {
                            const newSet = new Set(prevErrorPoints);
                            newSet.add(charIndex);
                            return newSet;
                        });
                    }
                    newState[charIndex] =
                        currentChar === " " ? "bg-red-500" : "text-red-500";
                    return newState;
                });
            }
            setCharIndex((prevCharIndex) => {
                setMaxCharIndex(prevCharIndex + 1);
                return prevCharIndex + 1;
            });
        },
        [charIndex, errorPoints]
    );

    const handleInputChange = useCallback(
        (key: string, ctrlKey: boolean) => {
            // Check for specific keys like Backspace
            if (isTyping && key === "Backspace") {
                if (ctrlKey) {
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
                if (paragraph.length > charIndex && timeLeft >= 0 && !timesUp) {
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

    useEffect(() => {
        if (timesUp) {
            findPracticeWords();
        }
    }, [timesUp, findPracticeWords]);

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

    useEffect(() => {
        if (
            charIndex != 0 &&
            paragraph[charIndex - 1] === " " &&
            paragraph[charIndex] !== " "
        ) {
            setCharIndexAfterSpace(charIndex);
        }
    }, [charIndex, paragraph]);

    useEffect(() => {
        if (!highMistakeAlert) {
            checkHighMistakes();
        }
    }, [mistakes, highMistakeAlert, checkHighMistakes]);

    useEffect(() => {
        if (highMistakeAlert) {
            setTimesUp(true);
            setIsTyping(false);
            inputRef.current?.blur();
            setPauseTime(true);
            setIsTyping(false);
        }
    }, [highMistakeAlert, inputRef, setPauseTime, setTimesUp]);

    return {
        charIndex,
        mistakes,
        isCharCorrectWrong,
        maxCharIndex,
        errorPoints,
        highMistakeAlert,
        timeLeft,
        setTimeLeft,
        timesUp,
        setTimesUp,
        wpm,
        cpm,
        setStartTime,
        isTyping,
        setIsTyping,
        practiceWords,
    };
};

export default useTypingState;
