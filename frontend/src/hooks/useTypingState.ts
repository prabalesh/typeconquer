import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useDispatch } from "react-redux";
import { setParagraph } from "../features/typing/typingSlice";

const useTypingState = () => {
    const { paragraph, difficulty, includeSymbols, includeNumbers } =
        useSelector((state: RootState) => state.typing);

    const dispatch = useDispatch();

    const [charIndex, setCharIndex] = useState<number>(0);
    const [charIndexAfterSpace, setCharIndexAfterSpace] = useState<number>(0);
    const [maxCharIndex, setMaxCharIndex] = useState<number>(0);

    const [mistakes, setMistakes] = useState<number>(0);
    const [highMistakeAlert, setHighMistakeAlert] = useState<boolean>(false);

    const [isCharCorrectWrong, setIsCharCorrectWrong] = useState<string[]>([]);

    const [errorPoints, setErrorPoints] = useState<Set<number>>(new Set());

    // dynamic paragraph expansion
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
            const words: string[] = data.words as string[];
            const newParagraph = [...paragraph, ...words];
            dispatch(setParagraph(newParagraph));
        }
    }, [
        charIndex,
        difficulty,
        dispatch,
        includeNumbers,
        includeSymbols,
        paragraph,
    ]);

    const checkHighMistakes = useCallback(() => {
        if (charIndex > 120 && mistakes > charIndex * 0.6) {
            setHighMistakeAlert(true);
        }
    }, [charIndex, mistakes]);

    const handleCtrlBackspace = () => {
        if (charIndex != charIndexAfterSpace) {
            setIsCharCorrectWrong((prevState) => {
                for (let i = charIndexAfterSpace; i < charIndex; i++) {
                    prevState[i] = "";
                }
                return prevState;
            });
            setCharIndex(charIndexAfterSpace);
        }
    };

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

    useEffect(() => {
        if (!highMistakeAlert) {
            checkHighMistakes();
        }
    }, [mistakes, highMistakeAlert, checkHighMistakes]);

    // handling backspace
    const handleBackSpace = () => {
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
    };

    // validating input
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

    return {
        charIndex,
        mistakes,
        isCharCorrectWrong,
        handleCharInput,
        handleBackSpace,
        maxCharIndex,
        errorPoints,
        highMistakeAlert,
        handleCtrlBackspace,
    };
};

export default useTypingState;
