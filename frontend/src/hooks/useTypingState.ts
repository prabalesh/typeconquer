import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

import useTimer from "./useTimer";
import useTypingStats from "./useTypingStats";

const useTypingState = (inputRef: React.RefObject<HTMLInputElement>) => {
    const { paragraph, timeLimit } = useSelector(
        (state: RootState) => state.typing
    );

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

    const [timeLeft, timesUp, setTimeLeft, setTimesUp, setPauseTime] =
        useTimer(isTyping);
    const [wpm] = useTypingStats(
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

    const findPracticeWords = useCallback(() => {
        const content = paragraph.slice(0, maxCharIndex + 1).join("");
        const points = [...errorPoints];

        const words = content.split(/\s+/); // Split by whitespace including non-breaking spaces

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

    const handleCtrlBackspace = useCallback(() => {
        if (charIndex !== charIndexAfterSpace) {
            setIsCharCorrectWrong((prevState) => {
                for (let i = charIndexAfterSpace; i < charIndex; i++) {
                    prevState[i] = "";
                }
                return prevState;
            });
            setCharIndex(charIndexAfterSpace);
        }
    }, [charIndex, charIndexAfterSpace]);

    const handleBackSpace = useCallback(() => {
        setCharIndex((prevCharIndex) => {
            setIsCharCorrectWrong((prevState) => {
                const newState = [...prevState];
                if (
                    newState[prevCharIndex - 1] === "text-red-500" ||
                    newState[prevCharIndex - 1] === "bg-red-500"
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

    const handleCharInput = useCallback(
        (typedChar: string, currentChar: string) => {
            if (typedChar === currentChar) {
                setIsCharCorrectWrong((prevState) => {
                    const newState = [...prevState];
                    newState[charIndex] = "text-green-500";
                    return newState;
                });
            } else {
                setMistakes((prevMistakes) => prevMistakes + 1);
                setIsCharCorrectWrong((prevState) => {
                    const newState = [...prevState];
                    if (!errorPoints.has(charIndex) && currentChar !== " ") {
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
            } else if (key === "Shift" || key === "Control" || key === "Alt") {
                // Ignore Shift, Control, and Alt keys
                return;
            } else if (
                !ctrlKey &&
                /^[\p{L}\p{N}\p{P}\p{S}\p{Zs}]+$/u.test(key) // Unicode regex for letters, numbers, punctuation, symbols, and spaces
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

    useEffect(() => {
        const inputElement = inputRef.current;
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        let previousValue = inputElement ? inputElement.value : "";

        if (inputElement) {
            const handleKeyDown = (e: KeyboardEvent) => {
                handleInputChange(e.key, e.ctrlKey);
                if (e.key === "Escape") {
                    inputElement.blur();
                }
            };

            const handleInput = () => {
                const currentValue = inputElement.value;

                if (currentValue.length < previousValue.length) {
                    handleInputChange("Backspace", false);
                } else {
                    const lastChar = currentValue[currentValue.length - 1];
                    handleInputChange(lastChar, false);
                }

                previousValue = currentValue;
            };

            inputElement.addEventListener("keydown", handleKeyDown);
            if (isMobile) {
                inputElement.addEventListener("input", handleInput);
            }

            return () => {
                inputElement.removeEventListener("keydown", handleKeyDown);
                if (isMobile) {
                    inputElement.removeEventListener("input", handleInput);
                }
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
            charIndex !== 0 &&
            /\s/.test(paragraph[charIndex - 1]) &&
            !/\s/.test(paragraph[charIndex])
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

    const resetTypingState = useCallback(() => {
        setIsTyping(false);
        setStartTime(null);
        setCharIndex(0);
        setCharIndexAfterSpace(0);
        setMaxCharIndex(0);
        setMistakes(0);
        setHighMistakeAlert(false);
        setIsCharCorrectWrong([]);
        setErrorPoints(new Set());
        setPracticeWords([]);
        setTimeLeft(timeLimit);
        setTimesUp(false);
        setPauseTime(false);
    }, [timeLimit, setPauseTime, setTimeLeft, setTimesUp]);

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
        setStartTime,
        isTyping,
        setIsTyping,
        practiceWords,
        resetTypingState,
    };
};

export default useTypingState;
