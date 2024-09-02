import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useFetchChallenges } from "../api/hooks/useFetchChallenges";
import formatRelativeTime from "../utils/relativeTime";

const ChallengesPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [filter, setFilter] = useState<
        "all" | "my" | "their" | "pending" | "won" | "lost"
    >("all");
    const [currentPage, setCurrentPage] = useState(1);

    // fetches the challenges based on filters
    const { challenges, loading, error, totalPages } = useFetchChallenges(
        filter,
        currentPage
    );

    const handlePageChange = (direction: "prev" | "next") => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Challenges Faced</h2>
            <div className="mb-4 flex flex-wrap gap-2 md:gap-4">
                {["all", "my", "their", "pending", "won", "lost"].map(
                    (type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type as typeof filter)}
                            className={`bg-[--highlighted-color] px-2 py-1 ${
                                filter === type ? "font-bold" : ""
                            }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                            Challenges
                        </button>
                    )
                )}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {challenges.length > 0 ? (
                <ul className="space-y-4">
                    {challenges.map((challenge) => {
                        const isChallenger =
                            challenge.challenger._id === user.id;
                        const myResult = isChallenger
                            ? challenge.typingTestResult
                            : challenge.friendTestResult;
                        const opponentResult = isChallenger
                            ? challenge.friendTestResult
                            : challenge.typingTestResult;

                        return (
                            <li
                                key={challenge._id}
                                className={`border p-4 rounded-xl shadow ${
                                    isChallenger && "bg-[--highlighted-color]"
                                }`}
                            >
                                <h3 className="text-xl font-semibold">
                                    {isChallenger
                                        ? `You challenged ${challenge.challengedFriend.name}`
                                        : `Challenged by ${challenge.challenger.name}`}
                                    {challenge.status === "completed" && (
                                        <span>
                                            {" "}
                                            {challenge.winner &&
                                            challenge.winner._id === user.id ? (
                                                <span className="text-green-500">
                                                    (You Won!)
                                                </span>
                                            ) : (
                                                <span className="text-red-500">
                                                    (You Lost!)
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </h3>
                                <p>
                                    Challenged:{" "}
                                    {formatRelativeTime(
                                        challenge.challengeDate
                                    )}
                                </p>
                                <p>Status: {challenge.status}</p>
                                {challenge.status === "completed" && (
                                    <>
                                        <p className="font-bold">
                                            Winner: {challenge.winner?.name}
                                        </p>
                                        <div className="flex justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-md">
                                                    You
                                                </p>
                                                <p>
                                                    WPM:{" "}
                                                    {myResult?.wpm || "N/A"}
                                                </p>
                                                <p>
                                                    Accuracy:{" "}
                                                    {myResult?.accuracy ||
                                                        "N/A"}
                                                    %
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-md">
                                                    Opponent
                                                </p>
                                                <p>
                                                    WPM:{" "}
                                                    {opponentResult?.wpm ||
                                                        "N/A"}
                                                </p>
                                                <p>
                                                    Accuracy:{" "}
                                                    {opponentResult?.accuracy ||
                                                        "N/A"}
                                                    %
                                                </p>
                                            </div>
                                        </div>
                                        <p>
                                            Completed:{" "}
                                            {challenge.completedDate &&
                                                formatRelativeTime(
                                                    challenge.completedDate
                                                )}
                                        </p>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No challenges found for this filter.</p>
            )}

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ChallengesPage;
