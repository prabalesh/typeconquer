import { useState, useEffect } from "react";
import { Challenge } from "../../types/index";

interface UseChallengesResult {
    challenges: Challenge[];
    loading: boolean;
    error: string | null;
    totalPages: number;
}

export function useFetchChallenges(
    filter: string,
    currentPage: number
): UseChallengesResult {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);

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
                    setError(data.message || "Error fetching challenges");
                }
            } catch {
                setError("Error fetching challenges");
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [filter, currentPage]);

    return { challenges, loading, error, totalPages };
}
