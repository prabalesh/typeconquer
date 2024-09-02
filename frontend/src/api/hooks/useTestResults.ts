import { useState, useCallback } from "react";
import { TestResultType } from "../../types";

export function useTestResults(pageNum: number, pageLimit: number) {
    const [testResults, setResults] = useState<TestResultType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string | null>(null);
    const [hasMoreResults, setHasMoreResults] = useState<boolean>(true);

    const fetchResults = useCallback(async () => {
        setIsLoading(true);
        const apiUrl = `${
            import.meta.env.VITE_API_URL
        }/api/typingtests/results?page=${pageNum}&limit=${pageLimit}`;

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Server error!");
            }

            const data = await res.json();
            if (data.success) {
                if ("testResults" in data) {
                    const results = data["testResults"] as TestResultType[];
                    setResults(results);
                    setHasMoreResults(results.length === pageLimit);
                } else {
                    setErrors(data.message || "Unknown error");
                }
            }
        } catch {
            setErrors("Failed to fetch typing test results");
        }

        setIsLoading(false);
    }, [pageNum, pageLimit]);

    return { testResults, isLoading, errors, hasMoreResults, fetchResults };
}
