import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function TypingTestSummary({
    mistakes,
    accuracy,
    errorPoints,
    practiceWords,
}: {
    mistakes: number;
    accuracy: string;
    errorPoints: Set<number>;
    practiceWords: string[];
}) {
    const { paragraph } = useSelector((state: RootState) => state.typing);
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="mt-5 text-center pb-4 space-y-4 bordered rounded-xl p-4 sm:p-8 w-full max-w-4xl mx-auto">
            <p className="text-2xl sm:text-3xl font-semibold pb-2 border-bottom">
                Time's Up
            </p>
            <div className="text-lg text-gray-500 space-y-4">
                <p className="text-xl font-medium">
                    <span>Mistakes:</span> <span>{mistakes}</span>
                </p>
                <p className="text-xl font-medium">
                    <span>Accuracy: </span>
                    <span>{accuracy}%</span>
                </p>

                {errorPoints.size > 0 && (
                    <p className="text-xl font-medium">
                        <span>Mistaken characters: </span>
                        {[...errorPoints].slice(0, 10).map((errorPoint, i) => (
                            <span key={i}>
                                {paragraph[errorPoint]}
                                {i !== 9 && ", "}
                            </span>
                        ))}
                        {errorPoints.size > 10 && (
                            <span>
                                +{errorPoints.size - 10} more characters
                            </span>
                        )}
                    </p>
                )}

                {practiceWords.length > 0 && (
                    <div>
                        <p className="text-xl font-medium my-2">
                            Practice words:{" "}
                        </p>
                        <div className="flex flex-wrap justify-center py-2">
                            {practiceWords
                                .slice(0, 4)
                                .map((word, wordIndex) => (
                                    <div
                                        key={wordIndex}
                                        className="inline-block bordered py-2 px-4 sm:px-8 rounded-3xl m-1"
                                    >
                                        {word}
                                    </div>
                                ))}
                            {practiceWords.length > 4 && (
                                <div className="inline-block py-2 m-1">
                                    +{practiceWords.length - 4} more words
                                </div>
                            )}
                        </div>
                        <div>
                            {user.id ? (
                                <p>
                                    <Link
                                        className="underline text-blue-500"
                                        to={"/typingtest/results"}
                                    >
                                        Click here
                                    </Link>{" "}
                                    to see your results
                                </p>
                            ) : (
                                <p>
                                    <Link
                                        to={"/auth/login"}
                                        className="underline text-blue-500"
                                    >
                                        Login
                                    </Link>{" "}
                                    to see your results
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TypingTestSummary;
