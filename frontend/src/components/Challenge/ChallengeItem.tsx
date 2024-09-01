import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { siderbarClose } from "../../features/sidebar/sidebarsSice";
import formatRelativeTime from "../../utils/relativeTime";
import { ChallengeType } from "../../types";

function ChallengeItem({ challenge }: { challenge: ChallengeType }) {
    const dispatch = useDispatch();
    return (
        <li
            className="flex flex-col gap-2 bordered rounded-xl p-2 text-sm text-center"
            key={challenge._id}
        >
            <div className="flex flex-col gap-2">
                <div>
                    <p className="font-bold truncate">
                        Challenge from {challenge.challenger.name}
                    </p>
                    <p>@{challenge.challenger.username}</p>
                </div>
                <div className="flex gap-4 justify-around">
                    <div>{challenge.typingTestResult.duration}s</div>
                    <div>{challenge.typingTestResult.wpm} WPM</div>
                    <div>{challenge.typingTestResult.accuracy}% Accuracy</div>
                </div>
                <div className="text-center">
                    {formatRelativeTime(challenge.createdAt)}
                </div>
                <div className="flex gap-1">
                    <Link
                        to={`/challenge/${challenge._id}`}
                        onClick={() => dispatch(siderbarClose())}
                        className="inline-block text-center bg-[--button-hover] w-2/4 hover:bg-green-600"
                    >
                        Accept
                    </Link>
                    <button className="bg-[--bg-color] w-2/4 hover:bg-red-600">
                        Decline
                    </button>
                </div>
            </div>
        </li>
    );
}

export default ChallengeItem;
