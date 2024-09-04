import TypingDisplay from "./TypingDisplay";
import TypingInput from "./TypingInput";

import { useRef, useState, useCallback, useEffect } from "react";
import TypingStats from "./TypingStats";
import useTypingState from "../../hooks/useTypingState";
import TypingOptions from "./TypingOptions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setTimeLimit } from "../../features/typing/typingSlice";
import LowAccurarcyWarning from "./LowAccuracuWarning";
import CongratsModal from "../CongratsModal";
import TypingTestSummary from "./TypingTestSummary";

import { setParagraph } from "../../features/typing/typingSlice";
import { StatusType, TestResultType } from "../../types";
import FriendListModal from "../Friends/FriendListModal";
import StatusModal from "../Challenge/StatusModal";

export default function TypingTest({
    handleGenerateParagraph,
}: {
    handleGenerateParagraph: () => void;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { paragraph, timeLimit, difficulty, includeNumbers, includeSymbols } =
        useSelector((state: RootState) => state.typing);
    const user = useSelector((state: RootState) => state.user);

    const [resetGameFlag, setResetGameFlag] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [bestWpm, setBestWpm] = useState<number>(0);

    const [modalOpen, setModalOpen] = useState(true); // for congrats modal

    const [openFriendsModal, setOpenFriendsModal] = useState<boolean>(false);

    const [statusOfTest, setStatusOfTest] = useState<StatusType>({
        message: "",
        isLoading: false,
        isFailure: false,
        isSuccess: false,
    });
    const [openStatusModal, setOpenStatusModal] = useState<boolean>(true);

    const {
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
    } = useTypingState(inputRef);

    const resetGame = useCallback(() => {
        setTimeLeft(timeLimit);
        setIsTyping(false);
        setStartTime(null);
        setTimesUp(false);
        setTestResult(null);
        inputRef.current?.focus();
        if (resetGameFlag) {
            handleGenerateParagraph();
        }
    }, [
        setTimeLeft,
        timeLimit,
        setIsTyping,
        setStartTime,
        setTimesUp,
        resetGameFlag,
        handleGenerateParagraph,
    ]);

    const [testResult, setTestResult] = useState<TestResultType | null>(null);

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
        setStatusOfTest({
            message: "Submitting test report!",
            isLoading: true,
            isFailure: false,
            isSuccess: false,
        });

        const apiURL = import.meta.env.VITE_API_URL;
        const accuracy = (
            ((charIndex + 1 - mistakes) / (charIndex + 1)) *
            100
        ).toFixed(2);
        try {
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

            if (!res.ok) {
                throw new Error("Can't submit test result");
            }
            const data = await res.json();
            if (data["success"]) {
                setTestResult(data["result"]);
                setStatusOfTest({
                    message: "Submitted test report!",
                    isLoading: false,
                    isFailure: false,
                    isSuccess: true,
                });
            } else {
                setStatusOfTest({
                    message: "Failed to submit test report!",
                    isLoading: false,
                    isFailure: true,
                    isSuccess: false,
                });
            }
        } catch {
            setStatusOfTest({
                message: "Failed to submit test report!",
                isLoading: false,
                isFailure: true,
                isSuccess: false,
            });
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
        resetGame();
        setResetGameFlag(false);
    }, [timeLimit, resetGame, resetGameFlag]);

    useEffect(() => {
        localStorage.setItem("ctime", timeLimit.toString());
    }, [timeLimit]);

    useEffect(() => {
        if (isTyping && user.id) {
            fetchBestResult();
        }
    }, [fetchBestResult, isTyping, user.id]);

    useEffect(() => {
        if (timesUp) {
            submitResult();
        }
    }, [timesUp, submitResult]);

    return (
        <div
            className={`max-w-7xl mx-auto p-4 text-footer-text flex flex-col items-center ${
                timesUp && "shake"
            }`}
        >
            {" "}
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
                        <>
                            <TypingTestSummary
                                mistakes={mistakes}
                                accuracy={(
                                    ((charIndex + 1 - mistakes) /
                                        (charIndex + 1)) *
                                    100
                                ).toFixed(2)}
                                errorPoints={errorPoints}
                                practiceWords={practiceWords}
                            />
                            {timesUp && user.id && openStatusModal && (
                                <StatusModal
                                    status={statusOfTest}
                                    onClose={() => setOpenStatusModal(false)}
                                />
                            )}
                            {testResult && (
                                <>
                                    <button
                                        onClick={() =>
                                            setOpenFriendsModal(true)
                                        }
                                        className="my-2 bordered px-4 py-2 rounded-3xl hover:bg-[--button-hover] hover:text-[--button-hover-text]"
                                    >
                                        Challenge a friend?
                                    </button>
                                    <FriendListModal
                                        isOpen={openFriendsModal}
                                        closeModal={() =>
                                            setOpenFriendsModal(false)
                                        }
                                        typingTestID={testResult._id.toString()}
                                    />
                                </>
                            )}
                        </>
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
