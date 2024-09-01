import { useState } from "react";
import { BestWpmResultType, TestResultType } from "../../types";
import formatRelativeTime from "../../utils/relativeTime";
import FriendListModal from "../Friends/FriendListModal";

function TestResultsItem({
    bestWpmResult,
    result,
}: {
    bestWpmResult: BestWpmResultType | null;
    result: TestResultType;
}) {
    const [openFriendsModal, setOpenFriendsModal] = useState<boolean>(false);
    return (
        <div
            className={`p-4 ${
                bestWpmResult &&
                bestWpmResult.testResultID === result._id.toString()
                    ? "animated-border"
                    : "bordered"
            } rounded-2xl text-center `}
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
            <div className="mb-2 pb-2 border-b-2 border-[var(--text-color)] ">
                <div className="flex justify-between">
                    <p>Mistakes: {result.errorPoints.length}</p>
                    <p>{result.wpm} WPM</p>
                </div>
                <div className="flex justify-between">
                    <p>{result.duration}s</p>
                    <p>Accuracy: {result.accuracy}%</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p>{formatRelativeTime(result.testDate)}</p>
                <button
                    onClick={() => setOpenFriendsModal(true)}
                    className="my-2 bordered px-4 py-2 rounded-3xl hover:bg-[--button-hover] hover:text-[--button-hover-text]"
                >
                    Challenge a friend?
                </button>
            </div>
            <FriendListModal
                isOpen={openFriendsModal}
                closeModal={() => setOpenFriendsModal(false)}
                typingTestID={result._id.toString()}
            />
        </div>
    );
}

export default TestResultsItem;
