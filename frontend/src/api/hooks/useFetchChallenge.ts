import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setParagraph, setTimeLimit } from "../../features/typing/typingSlice";

interface Challenge {
    challenger: {
        id: string;
        name: string;
        username: string;
    };
    challengedFriend: string;
    typingTestResult: {
        wpm: number;
        accuracy: number;
        text: string;
        duration: number;
    };
    status: string;
}

interface UseFetchChallengeProps {
    challengeID: string | undefined;
}

export default function useFetchChallenge({
    challengeID,
}: UseFetchChallengeProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const dispatch = useDispatch();

    const fetchChallenge = useCallback(async () => {
        if (!challengeID) {
            setError("Challenge ID is missing");
            setLoading(false);
            return;
        }
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
                throw new Error(errorData.error || "Error fetching challenge");
            }

            const data = await response.json();
            if (data.success) {
                setChallenge(data.challenge);
                dispatch(
                    setParagraph(data.challenge.typingTestResult.text.split(""))
                );
                dispatch(
                    setTimeLimit(data.challenge.typingTestResult.duration)
                );
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [challengeID, dispatch]);

    useEffect(() => {
        fetchChallenge();
    }, [fetchChallenge]);

    return { challenge, loading, error };
}
