import { useEffect, useRef, useCallback } from "react";
import { Lesson } from "../../types";
import { generateTextContent } from "../../utils/generateTextContent";
import TypingInput from "../TypingTest/TypingInput";
import Keyboard from "../Keyboard/Keyboard";
import { setParagraph } from "../../features/typing/typingSlice";
import { useDispatch, useSelector } from "react-redux";
import useLessonState from "../../hooks/useLessonState";
import { RootState } from "../../app/store";

function IntroductionLesson({ lesson }: { lesson: Lesson }) {
    const { paragraph } = useSelector((state: RootState) => state.typing);

    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const {
        charIndex,
        isCharCorrectWrong,
        wpm,
        accuracy,
        mistakes,
        resetState,
    } = useLessonState(inputRef, false);

    const initializeLesson = useCallback(() => {
        const content = generateTextContent(lesson.words, 120, 6);
        dispatch(setParagraph(content.split("")));
        inputRef.current?.focus();
    }, [dispatch, lesson.words]);

    useEffect(() => {
        initializeLesson();
    }, [initializeLesson]);

    const handleTryAgain = () => {
        resetState();
        initializeLesson();
    };

    return (
        <div className="h-[70vh] flex flex-col justify-between">
            <div className="mb-4" style={{ maxHeight: "25vh" }}>
                <Keyboard />
            </div>
            <div
                className="text-center flex flex-col items-center"
                onClick={() => inputRef.current?.focus()}
            >
                <TypingInput inputRef={inputRef} />
                <div
                    className="text-3xl w-full flex flex-wrap justify-center mt-4"
                    style={{ lineHeight: "60px" }}
                >
                    <div
                        className="flex flex-wrap gap-2 justify-center max-w-6xl mx-auto text-[--cursor-text-color]"
                        style={{ letterSpacing: "2.5px" }}
                    >
                        {paragraph.map((char, i) => (
                            <span
                                key={i}
                                className={`flex items-center justify-center w-10 h-12 border rounded-md ${
                                    isCharCorrectWrong[i]
                                } ${charIndex === i && "bg-yellow-500"}`}
                                style={{
                                    fontSize: "24px",
                                    border: "1px solid gray",
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <p>{wpm} wpm</p>
                <p>{accuracy?.toFixed(2)}%</p>
                <p>{mistakes} misatkes</p>
                <i
                    className="fa-solid fa-arrow-rotate-right"
                    onClick={() => handleTryAgain()}
                ></i>
            </div>
        </div>
    );
}

export default IntroductionLesson;
