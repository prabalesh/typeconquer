import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { TestResultType } from "../../types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { siderbarClose } from "../../features/sidebar/sidebarsSice";
import formatRelativeTime from "../../utils/relativeTime";

interface ChalleneType {
    _id: string;
    challengeData: Date;
    challengedFriend: string;
    challenger: {
        _id: string;
        name: string;
        username: string;
    };
    createdAt: Date;
    status: "pending" | "accepted" | "declined" | "completed";
    typingTestResult: TestResultType;
}

function Challengebar() {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);

    const [pendingChallenges, setPendingChallenges] = useState<ChalleneType[]>(
        []
    );

    const fetchPendingChallenges = async () => {
        setIsLoading(true);
        const apiURL = `${import.meta.env.VITE_API_URL}/api/challenges/pending`;
        try {
            const response = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data["success"]) {
                setPendingChallenges(data.pendingChallenges);
            } else {
                setErrors("Failed to fetch pending challenges");
            }
        } catch (error) {
            console.error("Failed to fetch pending challenges:", error);
            setErrors("Failed to fetch pending challenges");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingChallenges();
    }, []);

    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-xl font-semibold mb-4">
                <span>Challenges </span>
                <i
                    className="fa-solid fa-rotate-right"
                    onClick={() => fetchPendingChallenges()}
                ></i>
            </div>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {errors ? (
                        <p>{errors}</p>
                    ) : (
                        <>
                            {pendingChallenges.length > 0 ? (
                                <ul className="flex flex-col gap-2">
                                    {pendingChallenges.map((challenge, i) => (
                                        <li
                                            className="flex flex-col gap-2 bordered p-2 text-sm text-center"
                                            key={i}
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    <p className="font-bold truncate">
                                                        Challenge from{" "}
                                                        {
                                                            challenge.challenger
                                                                .name
                                                        }
                                                    </p>
                                                    <p>
                                                        @
                                                        {
                                                            challenge.challenger
                                                                .username
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex gap-4 justify-around">
                                                    <div>
                                                        {
                                                            challenge
                                                                .typingTestResult
                                                                .duration
                                                        }
                                                        s
                                                    </div>
                                                    <div>
                                                        {
                                                            challenge
                                                                .typingTestResult
                                                                .wpm
                                                        }{" "}
                                                        WPM
                                                    </div>
                                                    <div>
                                                        {
                                                            challenge
                                                                .typingTestResult
                                                                .accuracy
                                                        }
                                                        % Accuracy
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    {formatRelativeTime(
                                                        challenge.createdAt
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Link
                                                        to={`/challenge/${challenge._id}`}
                                                        onClick={() =>
                                                            dispatch(
                                                                siderbarClose()
                                                            )
                                                        }
                                                        className="inline-block text-center bg-[--button-hover] w-2/4 hover:bg-green-600"
                                                    >
                                                        Accept
                                                    </Link>
                                                    <button className="bg-[--bg-color] w-2/4 hover:bg-red-600">
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No pending challenges</p>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Challengebar;
