import React, { useState, useEffect } from "react";
import formatRelativeTime from "../utils/relativeTime";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface Challenge {
    _id: string;
    challenger: {
        _id: string;
        name: string;
    };
    challengedFriend: {
        _id: string;
        name: string;
    };
    typingTestResult: {
        wpm: number;
        accuracy: number;
    };
    friendTestResult?: {
        wpm: number;
        accuracy: number;
    };
    status: "pending" | "accepted" | "declined" | "completed";
    challengeDate: Date;
    completedDate?: Date;
    winner?: {
        _id: string;
        name: string;
    };
}

const ChallengesPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);

    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<
        "all" | "my" | "their" | "pending" | "won" | "lost"
    >("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const userID = user.id;

    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/challenges/?filter=${filter}&page=${currentPage}&limit=10`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await response.json();
                if (data.success) {
                    setChallenges(data.challenges);
                    setTotalPages(data.totalPages);
                } else {
                    console.error("Error fetching challenges:", data.message);
                }
            } catch (error) {
                console.error("Error fetching challenges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [filter, currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Challenges Faced</h2>
            <div className="mb-4 flex gap-4">
                <button
                    onClick={() => setFilter("all")}
                    className="bg-[--highlighted-color] px-2 py-1"
                >
                    All Challenges
                </button>
                <button
                    onClick={() => setFilter("my")}
                    className="bg-[--highlighted-color] px-2 py-1"
                >
                    My Challenges
                </button>
                <button
                    onClick={() => setFilter("their")}
                    className="bg-[--highlighted-color] px-2 py-1"
                >
                    Their Challenges
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className="bg-[--highlighted-color] px-2 py-1"
                >
                    Pending Challenges
                </button>
                <button
                    onClick={() => setFilter("won")}
                    className="bg-[--highlighted-color] px-2 py-1"
                >
                    Won Challenges
                </button>
                <button
                    onClick={() => setFilter("lost")}
                    className="bg-[--highlighted-color] px-2 py-1"
                >
                    Lost Challenges
                </button>
            </div>

            {challenges.length > 0 ? (
                <ul className="space-y-4">
                    {challenges.map((challenge) => (
                        <li
                            key={challenge._id}
                            className="border p-4 rounded shadow"
                        >
                            <h3 className="text-xl font-semibold">
                                {challenge.challenger._id === userID
                                    ? `You challenged ${challenge.challengedFriend.name}`
                                    : `Challenged by ${challenge.challenger.name}`}
                            </h3>
                            <p>
                                Challenge Date:{" "}
                                {formatRelativeTime(challenge.challengeDate)}
                            </p>
                            <p>Status: {challenge.status}</p>
                            {challenge.status === "completed" && (
                                <>
                                    <p>Winner: {challenge.winner?.name}</p>
                                    <p>
                                        Your WPM:{" "}
                                        {challenge.friendTestResult?.wpm ||
                                            "N/A"}
                                        , Accuracy:{" "}
                                        {challenge.friendTestResult?.accuracy ||
                                            "N/A"}
                                        %
                                    </p>
                                    <p>
                                        {challenge.challenger.name}'s WPM:{" "}
                                        {challenge.typingTestResult.wpm},
                                        Accuracy:{" "}
                                        {challenge.typingTestResult.accuracy}%
                                    </p>
                                    <p>
                                        Completed Date:{" "}
                                        {challenge.completedDate &&
                                            formatRelativeTime(
                                                challenge.completedDate
                                            )}
                                    </p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No challenges found for this filter.</p>
            )}

            <div className="flex justify-between mt-4">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ChallengesPage;
