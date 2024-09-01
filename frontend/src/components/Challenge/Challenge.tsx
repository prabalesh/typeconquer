import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { AppDispatch, RootState } from "../../app/store";
import { setParagraph, setTimeLimit } from "../../features/typing/typingSlice";

import TypingTestSummary from "../TypingTest/TypingTestSummary";
import TypingDisplay from "../TypingTest/TypingDisplay";
import TypingInput from "../TypingTest/TypingInput";
import TypingStats from "../TypingTest/TypingStats";

import Spinner from "../Spinner";
import WinnerModal from "./WinnerModal";

import useTypingState from "../../hooks/useTypingState";

import { StatusType, TestResultType } from "../../types";
import StatusModal from "./StatusModal";

interface ReqUser {
    id: string;
    name: string;
    username: string;
}

interface TypingTestResult {
    wpm: number;
    accuracy: number;
    text: string;
    duration: number;
}

interface Challenge {
    challenger: ReqUser;
    challengedFriend: string;
    typingTestResult: TypingTestResult;
    status: string;
}

export interface SubmitChallengeResponse {
    success: boolean;
    challenge: {
        _id: string;
        challenger: { _id: string; name: string; username: string };
        challengedFriend: { _id: string; name: string; username: string };
        typingTestResult: {
            _id: string;
            wpm: number;
            accuracy: number;
            text: string;
            duration: number;
        };
        friendTestResult?: {
            _id: string;
            wpm: number;
            accuracy: number;
            text: string;
            duration: number;
        };
        status: "pending" | "accepted" | "declined" | "completed";
        challengeDate: string;
        completedDate?: string;
        winner: { _id: string };
    };
}

export interface SubmitChallengeRequest {
    challengeID: string;
    friendTestResultID: string;
}

export default function Challenge() {
    const user = useSelector((state: RootState) => state.user);
    const { paragraph, timeLimit } = useSelector(
        (state: RootState) => state.typing
    );

    const dispatch = useDispatch<AppDispatch>();

    const { challengeID } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [challenge, setChallenge] = useState<Challenge | null>(null);

    const [testResult, setTestResult] = useState<TestResultType | null>(null);
    const [submitChallengeResult, setSubmitChallengeResult] =
        useState<SubmitChallengeResponse | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [openWinnerModal, setOpenWinnerModal] = useState<boolean>(true);

    const [statusOfChallenge, setStatusOfChallenge] = useState<StatusType>({
        message: "",
        isLoading: false,
        isFailure: false,
        isSuccess: false,
    });
    const [openStatusModal, setOpenStatusModal] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenge = async () => {
            setLoading(true);
            const apiURL = `${
                import.meta.env.VITE_API_URL
            }/api/challenges/getChallenge`;
            try {
                const response = await fetch(apiURL, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ challengeID }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Error fetching challenge"
                    );
                }

                const data = await response.json();
                if (data["success"]) {
                    setChallenge(data.challenge);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [challengeID, dispatch]);

    useEffect(() => {
        if (challenge) {
            dispatch(setParagraph(challenge.typingTestResult.text.split("")));
            dispatch(setTimeLimit(challenge.typingTestResult.duration));
        }
    }, [challenge, dispatch]);

    const {
        charIndex,
        mistakes,
        isCharCorrectWrong,
        errorPoints,
        timeLeft,
        timesUp,
        wpm,
        cpm,
        practiceWords,
        maxCharIndex,
        setTimesUp,
    } = useTypingState(inputRef);

    const submitResult = useCallback(async () => {
        if (!user.id) return;

        setStatusOfChallenge({
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
                setStatusOfChallenge({
                    message: "Submitted test report!",
                    isLoading: true,
                    isFailure: false,
                    isSuccess: false,
                });
            } else {
                setStatusOfChallenge({
                    message: "Failed to submit test report!",
                    isLoading: false,
                    isFailure: true,
                    isSuccess: false,
                });
            }
        } catch {
            setStatusOfChallenge({
                message: "Failed to submit test report!",
                isLoading: false,
                isFailure: true,
                isSuccess: false,
            });
        }
    }, [
        charIndex,
        timeLimit,
        errorPoints,
        maxCharIndex,
        mistakes,
        paragraph,
        user.id,
        wpm,
    ]);

    const submitChallenge = useCallback(async () => {
        const apiURL = `${import.meta.env.VITE_API_URL}/api/challenges/submit`;
        if (!testResult) return;
        setStatusOfChallenge({
            message: "Submitting challenge report!",
            isLoading: true,
            isFailure: false,
            isSuccess: false,
        });
        try {
            const response = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    challengeID,
                    friendTestResultID: testResult._id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: SubmitChallengeResponse = await response.json();

            if (data["success"]) {
                console.log(data["challenge"]);
                setSubmitChallengeResult(data);
                toast.success("Challenge submitted successfully");
                setStatusOfChallenge({
                    message: "Submitted challenge report!",
                    isLoading: false,
                    isFailure: false,
                    isSuccess: true,
                });
            } else {
                setStatusOfChallenge({
                    message: "Failed to submit challenge report!",
                    isLoading: false,
                    isFailure: true,
                    isSuccess: false,
                });
            }
        } catch (error) {
            toast.error("Error submitting challenge");
            console.log(error);
            setStatusOfChallenge({
                message: "Failed to submit challenge report!",
                isLoading: false,
                isFailure: true,
                isSuccess: false,
            });
        }
    }, [challengeID, testResult]);

    const resetChallenge = useCallback(() => {
        setTimesUp(false);
    }, [setTimesUp]);

    useEffect(() => {
        resetChallenge();
    }, [resetChallenge]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (timesUp) {
            submitResult();
        }
    }, [timesUp, submitResult]);

    useEffect(() => {
        if (testResult && timesUp) {
            submitChallenge();
        }
    }, [timesUp, testResult, submitChallenge]);

    useEffect(() => {
        setTestResult(null);
        setSubmitChallengeResult(null);
        resetChallenge();
    }, [resetChallenge]);

    if (loading) {
        return (
            <div
                className="max-w-7xl mx-auto flex justify-center items-center"
                style={{ minHeight: "80vh" }}
            >
                <div>
                    <Spinner />
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div
            className={`max-w-7xl mx-auto p-4 text-footer-text flex flex-col items-center ${
                timesUp && "shake"
            }`}
        >
            {challenge && (
                <div className="text-center my-4">
                    <div className="font-bold">
                        <p className="text-2xl">
                            Challenge from {challenge.challenger.name}
                        </p>
                        <p>@{challenge.challenger.username}</p>
                    </div>
                    <div>
                        <p>{challenge.typingTestResult.wpm} WPM</p>
                        <p>{challenge.typingTestResult.accuracy}% accuracy</p>
                    </div>
                </div>
            )}
            {timesUp && openStatusModal && (
                <StatusModal
                    status={statusOfChallenge}
                    onClose={() => setOpenStatusModal(false)}
                />
            )}
            <TypingInput inputRef={inputRef} />
            {testResult && submitChallengeResult && timesUp && (
                <WinnerModal
                    isOpen={openWinnerModal}
                    onClose={() => {
                        setOpenWinnerModal(false);
                        navigate("/");
                    }}
                    accurracy={testResult.accuracy}
                    wpm={testResult.wpm}
                    challengerWPM={
                        submitChallengeResult.challenge.typingTestResult.wpm
                    }
                    challengerAccuracy={
                        submitChallengeResult.challenge.typingTestResult
                            .accuracy
                    }
                    defeat={
                        submitChallengeResult.challenge.winner._id.toString() !=
                        user.id
                    }
                />
            )}
            {paragraph.length > 0 &&
                (timesUp ? (
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
                ))}

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
