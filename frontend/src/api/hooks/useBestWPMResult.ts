import { useState, useCallback } from "react";
import { BestWpmResultType } from "../../types";

export function useBestWpmResult() {
    const [bestWpmResult, setBestWpmResult] =
        useState<BestWpmResultType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBestResult = useCallback(async () => {
        setIsLoading(true);
        const apiURL = `${
            import.meta.env.VITE_API_URL
        }/api/typingtests/bestresult`;

        try {
            const res = await fetch(apiURL, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch best result");
            }

            const data = await res.json();
            if ("bestWPM" in data) {
                setBestWpmResult(data);
            }
        } catch {
            console.error("Failed to fetch best WPM result");
        }

        setIsLoading(false);
    }, []);

    return { bestWpmResult, isLoading: isLoading, fetchBestResult };
}
