import { Friend } from "../../types";
import formatRelativeTime from "../../utils/relativeTime";
import UserAvatar from "../User/UserAvatar";

interface FriendItemProps {
    friend: Friend;
}

function FriendItem({ friend }: FriendItemProps) {
    return (
        <li
            className="w-full p-2 rounded-xl hover:bg-[--button-hover] hover:text-[--button-hover-text] border"
        >
            <div className="flex justify-between text-xs">
                <div className="flex gap-2">
                    <UserAvatar username={friend.name} />
                    <div className="text-xs truncate">
                        <p>{friend.name}</p>
                        <p>@{friend.username}</p>
                    </div>
                </div>
                <div className="text-xs truncate">
                    {formatRelativeTime(friend.lastLogin)}
                </div>
            </div>
        </li>
    );
}

export default FriendItem;
