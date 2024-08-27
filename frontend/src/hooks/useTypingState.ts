import { useState } from "react";

const useTypingState = () => {
    const [charIndex, setCharIndex] = useState<number>(0);
    const [isCharCorrectWrong, setIsCharCorrectWrong] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState<number>(0);

    const handleBackSpace = () => {
        setCharIndex((prevCharIndex) => {
            setIsCharCorrectWrong((prevState) => {
                const newState = [...prevState];
                if (
                    newState[prevCharIndex - 1] == "text-red-500" ||
                    newState[prevCharIndex - 1] == "bg-red-500"
                ) {
                    console.log("mistake gone");
                    setMistakes((prevMistakes) =>
                        prevMistakes - 1 < 0 ? 0 : prevMistakes - 1
                    );
                }
                newState[prevCharIndex - 1] = "";
                return newState;
            });
            return Math.max(prevCharIndex - 1, 0);
        });
    };

    const handleCharInput = (typedChar: string, currentChar: string) => {
        if (typedChar == currentChar) {
            setIsCharCorrectWrong((prevState) => {
                const newState = [...prevState];
                newState[charIndex] = "text-green-500";
                return newState;
            });
        } else {
            console.log("mistake");
            setMistakes((prevMistakes) => prevMistakes + 1);
            setIsCharCorrectWrong((prevState) => {
                const newState = [...prevState];
                newState[charIndex] =
                    currentChar === " " ? "bg-red-500" : "text-red-500";
                return newState;
            });
        }
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
    };

    return [
        charIndex,
        mistakes,
        isCharCorrectWrong,
        handleCharInput,
        handleBackSpace,
    ] as const;
};

export default useTypingState;
