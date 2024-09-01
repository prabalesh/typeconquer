import React, { useState, useEffect } from "react";

type Friend = {
    _id: string;
    name: string;
    username: string;
    lastLogin: string;
    challenge: undefined | string;
};

interface FriendModalProps {
    isOpen: boolean;
    closeModal: () => void;
    typingTestID: string;
}

export interface ChallengeResponse {
    success: boolean;
    message: string;
    challenge?: {
        _id: string;
        challenger: string;
        challengedFriend: string;
        typingTestResult: string;
    };
    error?: string;
}

const FriendListModal: React.FC<FriendModalProps> = ({
    isOpen,
    closeModal,
    typingTestID,
}) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch friends from API
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/friends/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch friends.");
                }

                const data = await response.json();
                if (data["success"]) {
                    setFriends(data["friends"]);
                }
            } catch (error) {
                console.log(error);
                setError("Couldn't fetch friends.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchFriends();
        }
    }, [isOpen]);

    const handleCreateChallenge = async (friend: Friend) => {
        const apiURL = `${import.meta.env.VITE_API_URL}/api/challenges/create`;
        try {
            const response = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    challengedFriendID: friend._id,
                    typingTestResultID: typingTestID,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { error: errorData.error || "An error occurred" };
            }

            const data: ChallengeResponse = await response.json();
            if (data["success"]) {
                setFriends((prevState) =>
                    prevState.map((frnd) =>
                        frnd._id === friend._id
                            ? {
                                  ...frnd,
                                  challenge: data["challenge"]?._id.toString(),
                              }
                            : frnd
                    )
                );
            }
        } catch (error) {
            console.error("Error creating challenge:", error);
            return { error: "Server error while creating the challenge" };
        }
    };

    const filteredFriends = friends.filter(
        (friend) =>
            friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[--highlighted-color] rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-[--highlighted-text] hover:text-[--button-hover] text-3xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">Your Friends</h2>

                <input
                    type="text"
                    placeholder="Search by name or username"
                    className="border p-2 mb-4 w-full rounded-md text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center">{error}</div>
                ) : (
                    <ul className="max-h-64 overflow-y-auto">
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <li key={friend._id} className="mb-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex gap-4 truncate">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${friend.name}&background=random`}
                                                alt="Profile"
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="font-semibold">
                                                    {friend.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    @{friend.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="">
                                            {!friend.challenge ? (
                                                <button
                                                    onClick={() =>
                                                        handleCreateChallenge(
                                                            friend
                                                        )
                                                    }
                                                    className="border px-4 py-1 border-[--border-color] rounded hover:bg-[--button-hover] hover:text-[--button-hover-text]"
                                                >
                                                    Challenge
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="order px-4 py-1 border-[--border-color] rounded bg-[--button-hover] text-[--button-hover-text]"
                                                >
                                                    Challenged
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-600">No friends found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendListModal;
