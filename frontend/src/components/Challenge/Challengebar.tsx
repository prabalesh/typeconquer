import { useEffect, useState } from "react";

import Spinner from "../Spinner";
import ChallengeItem from "./ChallengeItem";
import { ChallengeType } from "../../types";

import { toast } from "react-toastify";

const Challengebar: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);
    const [pendingChallenges, setPendingChallenges] = useState<ChallengeType[]>(
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

            if (data.success) {
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

    const handleDeclineChallenge = async (challengeID: string) => {
        const apiURL = `${import.meta.env.VITE_API_URL}/api/challenges/decline`;

        try {
            const res = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ challengeID }),
            });
            const data = await res.json();

            if (data["success"]) {
                toast.success(data["message"]);
                setPendingChallenges((prevState) => {
                    return prevState.filter(
                        (challenge: ChallengeType) =>
                            challenge._id.toString() !== challengeID
                    );
                });
            } else {
                toast.error(data["message"]);
            }
        } catch (error) {
            console.log("error during declining challenge", error);
            toast.error("Failed to decline challenge");
        }
    };

    return (
        <div className="relative flex-1 p-4 overflow-y-auto">
            <div className="text-xl font-semibold mb-4">
                <span>Challenges </span>
                <i
                    className="fa-solid fa-rotate-right cursor-pointer"
                    onClick={fetchPendingChallenges}
                ></i>
            </div>
            {isLoading ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Spinner />
                </div>
            ) : errors ? (
                <p>{errors}</p>
            ) : (
                <>
                    {pendingChallenges.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                            {pendingChallenges.map((challenge, i) => (
                                <ChallengeItem
                                    key={i}
                                    challenge={challenge}
                                    handleDeclineChallenge={
                                        handleDeclineChallenge
                                    }
                                />
                            ))}
                        </ul>
                    ) : (
                        <p>No pending challenges</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Challengebar;
