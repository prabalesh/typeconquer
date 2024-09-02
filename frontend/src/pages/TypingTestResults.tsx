import { useSelector } from "react-redux";
import { RootState } from "../app/store";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import LoginRequired from "../components/User/LoginRequired";
import Spinner from "../components/Spinner";
import TestResultsItem from "../components/TypingTestResults/TestResultsItem";

import { useBestWpmResult } from "../api/hooks/useBestWPMResult";
import { useTestResults } from "../api/hooks/useTestResults";

function TypingTestResults() {
    const user = useSelector((state: RootState) => state.user);

    const pageLimit = 10;
    const [pageNum, setPageNum] = useState<number>(1);

    const { testResults, isLoading, errors, hasMoreResults, fetchResults } =
        useTestResults(pageNum, pageLimit);
    const {
        bestWpmResult,
        isLoading: isBestWpmLoading,
        fetchBestResult,
    } = useBestWpmResult();

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
        <div className="mx-auto p-4 lg:w-[50vw] md:w-[60vw] sm:[95vw]">
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
                                                    <p className="text-xl md:text-2xl font-bold text-center">
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
                                                    <TestResultsItem
                                                        key={index}
                                                        bestWpmResult={
                                                            bestWpmResult
                                                        }
                                                        result={result}
                                                    />
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
