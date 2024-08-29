import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import LoginRequired from "../components/User/LoginRequired";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface TestResultType {
    _id: string;
    userID: string;
    accuracy: number;
    wpm: number;
    duration: number;
    testDate: Date;
    errorPoints: number[];
    text: string;
}

interface BestWpmResult {
    _id: string;
    userID: string;
    bestWPM: number;
    testResultID: string;
}

function TypingTestResults() {
    const user = useSelector((state: RootState) => state.user);

    const pageLimit = 20;
    const [pageNum, setPageNum] = useState<number>(1);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isBestWpmLoading, setIsBestWpmLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string | null>(null);

    const [testResults, setResults] = useState<TestResultType[]>([]);
    const [bestWpmResult, setBestWpmResult] = useState<BestWpmResult | null>(
        null
    );
    const [hasMoreResults, setHasMoreResults] = useState<boolean>(true); // To track if there are more results

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
            if (typeof data === "object" && "success" in data) {
                if (data.success) {
                    if ("testResults" in data) {
                        const results = data["testResults"] as TestResultType[];
                        setResults(results);
                        setHasMoreResults(results.length === pageLimit); // Check if there are more results
                    } else {
                        toast.error(data?.message || "Unknown error");
                    }
                }
            }
        } catch {
            toast.error("Failed to fetch results!");
            setErrors("Failed to fetch typing test results");
        }
        setIsLoading(false);
    }, [pageLimit, pageNum]);

    const fetchBestResult = useCallback(async () => {
        setIsBestWpmLoading(true);
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
            if (typeof data === "object" && "bestWPM" in data) {
                if (typeof data["bestWPM"] === "number") {
                    setBestWpmResult(data);
                }
            }
        } catch {
            console.error("Failed to fetch best WPM result");
        }
        setIsBestWpmLoading(false);
    }, []);

    useEffect(() => {
        fetchResults();
        fetchBestResult();
    }, [fetchBestResult, fetchResults, pageLimit, pageNum]);

    const handleNextPage = () => {
        if (hasMoreResults) setPageNum((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (pageNum > 1) setPageNum((prevPage) => prevPage - 1);
    };

    return (
        <div className="mx-auto p-4">
            {user.id ? (
                <>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div>
                            {errors ? (
                                <div className="text-center">
                                    <div className="my-2">{errors}</div>
                                    <button
                                        onClick={fetchResults}
                                        className="bg-[--bg-color] bordered rounded-3xl py-2 px-8 hover:bg-[--button-hover] hover:text-[--button-hover-text]"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {isBestWpmLoading ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            {bestWpmResult?.bestWPM != 0 && (
                                                <div className="animated-border p-4">
                                                    <p className="text-xl md:text-2xl font-bold">
                                                        ALL TIME BEST WPM:{" "}
                                                        {bestWpmResult?.bestWPM}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {testResults.length > 0 ? (
                                        <>
                                            {testResults.map(
                                                (result, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-4 ${
                                                            bestWpmResult &&
                                                            bestWpmResult.testResultID ===
                                                                result._id.toString()
                                                                ? "animated-border"
                                                                : "bordered"
                                                        } rounded-2xl`}
                                                    >
                                                        <p className="text-sm md:text-base">
                                                            {result.text
                                                                .split("")
                                                                .map(
                                                                    (
                                                                        char,
                                                                        charIndex
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                charIndex
                                                                            }
                                                                            className={`${
                                                                                result.errorPoints.includes(
                                                                                    charIndex
                                                                                )
                                                                                    ? "text-red-600"
                                                                                    : ""
                                                                            }`}
                                                                        >
                                                                            {
                                                                                char
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                        </p>
                                                        <p>
                                                            Mistakes:{" "}
                                                            {
                                                                result
                                                                    .errorPoints
                                                                    .length
                                                            }
                                                        </p>
                                                        <p>WPM: {result.wpm}</p>
                                                        <p>
                                                            Accuracy:{" "}
                                                            {result.accuracy}%
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center text-xl">
                                            <p>Nothing to show here.</p>
                                            <div>
                                                <p>
                                                    Attend some typing tests.{" "}
                                                </p>
                                                <Link
                                                    to={"/"}
                                                    className="underline text-blue-500"
                                                >
                                                    Click here to test your
                                                    typing skills
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-center gap-4 mt-4">
                                        {pageNum !== 1 && (
                                            <button
                                                onClick={handlePrevPage}
                                                disabled={pageNum === 1}
                                                className={`px-4 py-2 rounded-lg bg-[--button-bg] hover:bg-[--button-hover] text-white ${
                                                    pageNum === 1
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {hasMoreResults && (
                                            <button
                                                onClick={handleNextPage}
                                                disabled={!hasMoreResults}
                                                className={`px-4 py-2 rounded-lg bg-[--button-bg] hover:bg-[--button-hover] text-white ${
                                                    !hasMoreResults
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <LoginRequired />
            )}
        </div>
    );
}

export default TypingTestResults;
