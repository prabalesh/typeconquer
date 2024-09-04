import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export default function useLessonState(
    inputRef: React.RefObject<HTMLInputElement>,
    pauseOnError: boolean
) {
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [charIndex, setCharIndex] = useState<number>(0);
    const [isCharCorrectWrong, setIsCharCorrectWrong] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState<number>(0);

    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(0);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const { paragraph } = useSelector((state: RootState) => state.typing);

    const [leftShiftPressed, setLeftShiftPressed] = useState(false);
    const [rightShiftPressed, setRightShiftPressed] = useState(false);

    const leftHandChars = "qwertasdfgzxcvQWERTASDFGZXCV";
    const rightHandChars = "yuiophjklbnmYUIOPHJKLBNM";

    const resetState = () => {
        setIsTyping(false);
        setCharIndex(0);
        setIsCharCorrectWrong([]);
        setMistakes(0);
        setWpm(0);
        setAccuracy(0);
        setStartTime(null);
        setGameOver(false);
        setLeftShiftPressed(false);
        setRightShiftPressed(false);
    };

    const handleBackSpace = useCallback(() => {
        setCharIndex((prevCharIndex) => {
            setIsCharCorrectWrong((prevState) => {
                const newState = [...prevState];
                newState[prevCharIndex - 1] = "";
                return newState;
            });
            return Math.max(prevCharIndex - 1, 0);
        });
    }, []);

    const handleCharInput = useCallback(
        (typedChar: string, currentChar: string) => {
            const isUpperCase = currentChar === currentChar.toUpperCase();
            let isCorrectShift = true;

            if (isUpperCase) {
                if (leftHandChars.includes(currentChar)) {
                    isCorrectShift = rightShiftPressed;
                } else if (rightHandChars.includes(currentChar)) {
                    isCorrectShift = leftShiftPressed;
                }
            }

            if (typedChar === currentChar && (!isUpperCase || isCorrectShift)) {
                setIsCharCorrectWrong((prevState) => {
                    const newState = [...prevState];
                    newState[charIndex] = "bg-green-500";
                    return newState;
                });

                setCharIndex((prevCharIndex) => prevCharIndex + 1);
            } else {
                setIsCharCorrectWrong((prevState) => {
                    setMistakes((prevMistakes) => prevMistakes + 1);
                    const newState = [...prevState];
                    newState[charIndex] = "bg-red-500";
                    return newState;
                });

                if (!pauseOnError) {
                    setCharIndex((prevCharIndex) => prevCharIndex + 1);
                }
            }
        },
        [
            charIndex,
            leftHandChars,
            rightHandChars,
            leftShiftPressed,
            rightShiftPressed,
            pauseOnError,
        ]
    );

    const handleInputChange = useCallback(
        (key: string, ctrlKey: boolean) => {
            if (isTyping && key === "Backspace") {
                handleBackSpace();
            } else if (
                !ctrlKey &&
                /^[a-zA-Z0-9 `~!@#$%^&*()-_=+[\]{};:'",.<>?/\\|]$/.test(key)
            ) {
                if (ctrlKey) return;
                if (paragraph.length > charIndex && !gameOver) {
                    if (!isTyping) {
                        if (startTime === null)
                            setStartTime(new Date().getTime());
                        setIsTyping(true);
                    }
                    if (charIndex >= paragraph.length) setGameOver(true);
                    handleCharInput(key, paragraph[charIndex]);

                    if (paragraph.length <= charIndex + 1) {
                        setGameOver(true);
                        setIsTyping(false);
                    }
                } else {
                    setGameOver(true);
                    setIsTyping(false);
                }
            }
        },
        [
            charIndex,
            gameOver,
            handleBackSpace,
            handleCharInput,
            isTyping,
            paragraph,
            startTime,
        ]
    );

    useEffect(() => {
        const inputElement = inputRef.current;
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (inputElement) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Shift" && e.location === 1) {
                    setLeftShiftPressed(true);
                } else if (e.key === "Shift" && e.location === 2) {
                    setRightShiftPressed(true);
                }

                handleInputChange(e.key, e.ctrlKey);

                if (e.key === "Escape") {
                    inputElement.blur();
                }
            };

            const handleKeyUp = (e: KeyboardEvent) => {
                if (e.key === "Shift" && e.location === 1) {
                    setLeftShiftPressed(false);
                } else if (e.key === "Shift" && e.location === 2) {
                    setRightShiftPressed(false);
                }
            };

            const handleInput = () => {
                const currentValue = inputElement.value;
                const lastChar = currentValue[currentValue.length - 1];
                handleInputChange(lastChar, false);
            };

            inputElement.addEventListener("keydown", handleKeyDown);
            inputElement.addEventListener("keyup", handleKeyUp);

            if (isMobile) {
                inputElement.addEventListener("input", handleInput);
            }

            return () => {
                inputElement.removeEventListener("keydown", handleKeyDown);
                inputElement.removeEventListener("keyup", handleKeyUp);
                if (isMobile) {
                    inputElement.removeEventListener("input", handleInput);
                }
            };
        }
    }, [handleInputChange, inputRef]);

    useEffect(() => {
        if (!gameOver && startTime) {
            const nowTime = new Date().getTime();
            const elapsedTimeInMinutes = (nowTime - startTime) / 60000;

            if (elapsedTimeInMinutes > 0) {
                const wpm = Math.max(
                    Math.floor(
                        (charIndex + 1 - mistakes) / 5 / elapsedTimeInMinutes
                    ),
                    0
                );
                setAccuracy(
                    ((charIndex + 1 - mistakes) / (charIndex + 1)) * 100
                );
                setWpm(wpm);
            }
        }
    }, [charIndex, gameOver, mistakes, startTime]);

    return {
        charIndex,
        mistakes,
        isCharCorrectWrong,
        wpm,
        accuracy,
        gameOver,
        resetState,
    };
}
