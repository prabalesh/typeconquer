import {
    BestWpmResultType,
    TestResultType,
} from "../../types/TypingResultsTypes";
import formatRelativeTime from "../../utils/relativeTime";

function TestResultsItem({
    bestWpmResult,
    result,
}: {
    bestWpmResult: BestWpmResultType | null;
    result: TestResultType;
}) {
    return (
        <div
            className={`p-4 ${
                bestWpmResult &&
                bestWpmResult.testResultID === result._id.toString()
                    ? "animated-border"
                    : "bordered"
            } rounded-2xl text-center font-bold`}
        >
            <p className="text-sm md:text-base mb-2 pb-2 border-b-2 border-[var(--text-color)]">
                {result.text.split("").map((char, charIndex) => (
                    <span
                        key={charIndex}
                        className={`${
                            result.errorPoints.includes(charIndex)
                                ? "text-red-600"
                                : ""
                        }`}
                    >
                        {char}
                    </span>
                ))}
            </p>
            <div className="mb-2 pb-2 border-b-2 border-[var(--text-color)]">
                <div className="flex justify-between">
                    <p>Mistakes: {result.errorPoints.length}</p>
                    <p>{result.wpm} WPM</p>
                </div>
                <div className="flex justify-between">
                    <p>{result.duration}s</p>
                    <p>Accuracy: {result.accuracy}%</p>
                </div>
            </div>
            <p>{formatRelativeTime(result.testDate)}</p>
        </div>
    );
}

export default TestResultsItem;
