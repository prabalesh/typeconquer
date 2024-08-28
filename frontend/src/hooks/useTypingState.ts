import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useDispatch } from "react-redux";
import { setParagraph } from "../features/typing/typingSlice";

const useTypingState = () => {
    const [charIndex, setCharIndex] = useState<number>(0);
    const [isCharCorrectWrong, setIsCharCorrectWrong] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState<number>(0);

    const [maxCharIndex, setMaxCharIndex] = useState<number>(0);
    const [errorPoints, setErrorPoints] = useState<Set<number>>(new Set());

    const { paragraph, difficulty, includeSymbols, includeNumbers } =
        useSelector((state: RootState) => state.typing);
    const dispatch = useDispatch();

    const expandParagraph = useCallback(async () => {
        if (paragraph.length >= charIndex + 80) return;

        const res = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/api/generate-paragraph?difficulty=${difficulty}&includeSymbols=${includeSymbols}&includeNumbers=${includeNumbers}`
        );
        if (!res.ok) {
            return;
        }

        const data = await res.json();
        if (typeof data === "object" && "words" in data) {
            const words: string[] = data.words as string[]; // Ensure it's typed as string[]
            const newParagraph = [...paragraph, ...words]; // Concatenate previous state with new words
            dispatch(setParagraph(newParagraph)); // Dispatch the final paragraph array
        }
    }, [
        charIndex,
        difficulty,
        dispatch,
        includeNumbers,
        includeSymbols,
        paragraph,
    ]);

    useEffect(() => {
        let isMounted = true;

        const fetchParagraph = async () => {
            if (isMounted) {
                await expandParagraph();
            }
        };

        fetchParagraph();

        return () => {
            isMounted = false;
        };
    }, [charIndex, expandParagraph]);

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
    };

    return [
        charIndex,
        mistakes,
        isCharCorrectWrong,
        handleCharInput,
        handleBackSpace,
        maxCharIndex,
        errorPoints,
    ] as const;
};

export default useTypingState;
