import TypingDisplay from "../TypingTest/TypingDisplay";
import TypingInput from "../TypingTest/TypingInput";

import { useRef, useState, useCallback, useEffect } from "react";
import TypingStats from "../TypingTest/TypingStats";
import useTypingState from "../../hooks/useTypingState";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";

import CongratsModal from "../CongratsModal";
import TypingTestSummary from "../TypingTest/TypingTestSummary";
import { setParagraph } from "../../features/typing/typingSlice";

export default function TypingTest() {
    const dispatch = useDispatch<AppDispatch>();
    dispatch(setParagraph("this is testing paragraph".split("")));

    const { paragraph, timeLimit } = useSelector(
        (state: RootState) => state.typing
    );
    const user = useSelector((state: RootState) => state.user);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [practiceWords, setPracticeWords] = useState<string[]>([]);

    const [bestWpm, setBestWpm] = useState<number>(0);

    const [modalOpen, setModalOpen] = useState(true); // for congrats modal

    const {
        charIndex,
        mistakes,
        isCharCorrectWrong,
        maxCharIndex,
        errorPoints,
        highMistakeAlert,
        timeLeft,
        timesUp,
        wpm,
        cpm,
        isTyping,
    } = useTypingState(inputRef);

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

    return (
        <div
            className={`max-w-7xl mx-auto p-4 text-footer-text flex flex-col items-center ${
                timesUp && "shake"
            }`}
        >
            <TypingInput inputRef={inputRef} />
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
                resetGame={null}
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
