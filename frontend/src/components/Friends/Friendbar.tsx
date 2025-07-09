import { useState, useEffect } from "react";
import FriendRequestModal from "./FriendRequestModal";
import PendingRequestsModal from "./PendingRequestModal";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { Friend } from "../../types";
import FriendItem from "./FriendItem";
import { RotateCw, UserCog, UserPlus } from "lucide-react";

export interface PendingRequestType {
    _id: string;
    receiver: string;
    status: string;
    createdAt: string;
    requester: {
        _id: string;
        name: string;
        username: string;
    };
}


function Friendbar() {
    const [openFrndReqModal, setOpenFrndReqModal] = useState(false);
    const [openPendingRequest, setOpenPendingRequest] = useState(false);

    const [friendlistLoading, setFriendListLoading] = useState<boolean>(true);
    const [errorFriendList, setErrorFriendList] = useState<string | null>(null);
    const [friendList, setFriendList] = useState<Friend[]>([]);

    const [pendingRequests, setPendingRequest] = useState<PendingRequestType[]>(
        []
    );

    const fetchFriendList = async () => {
        setFriendListLoading(true);
        const apiURL = `${import.meta.env.VITE_API_URL}/api/friends/`;

        try {
            const res = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error("Failed to fetch friendlist");
            }
            const data = await res.json();
            if (data["success"]) {
                setFriendList(data["friends"]);
                setFriendListLoading(false);
            }
        } catch (error) {
            console.log(error);
            setErrorFriendList("Failed to fetch friend list.");
        }
    };

    const fetchPendingRequest = async () => {
        const apiURL = `${
            import.meta.env.VITE_API_URL
        }/api/friends/pending-requests`;

        try {
            const res = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (data["success"]) {
                console.log(data["pendingRequests"]);
                setPendingRequest(data["pendingRequests"]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFriendList();
        fetchPendingRequest();
    }, []);

    return (
        <div className=" flex-1 p-4 border-b border-gray-600 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <div className="my-2 flex gap-4">
                <div>
                    <UserPlus
                        size={20}
                        onClick={() => setOpenFrndReqModal(true)}
                    />
                    <FriendRequestModal
                        isOpen={openFrndReqModal}
                        onClose={() => {
                            setOpenFrndReqModal(false);
                            fetchPendingRequest();
                        }}
                    />
                </div>
                <div className="relative inline-block">
                    <UserCog
                        size={20}
                        onClick={() => {
                            if (pendingRequests.length > 0) {
                                setOpenPendingRequest(true);
                            } else {
                                toast.error("No pending requests!");
                            }
                        }}
                    />
                    {pendingRequests.length > 0 && (
                        <div>
                            <div
                                className="absolute -top-0 -right-1 font-bold leading-none text-white bg-[--button-hover]"
                                style={{
                                    height: "10px",
                                    width: "10px",
                                    borderRadius: "50%",
                                }}
                            ></div>
                            {openPendingRequest && (
                                <PendingRequestsModal
                                    pendingRequests={pendingRequests}
                                    onClose={() => {
                                        setOpenPendingRequest(false);
                                        fetchPendingRequest();
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <RotateCw
                        size={20}
                        onClick={() => {
                            fetchFriendList();
                            fetchPendingRequest();
                        }}
                    />
                </div>
            </div>
            {friendlistLoading ? (
                <div className="h-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3">
                        <Spinner />
                    </div>
                </div>
            ) : (
                <>
                    {errorFriendList ? (
                        <div className="flex justify-center items-center text-red-500">
                            <p>{errorFriendList}</p>
                        </div>
                    ) : (
                        <>
                            {friendList.length > 0 ? (
                                <ul className="flex flex-col gap-1">
                                    {friendList.map((friend, i) => (
                                        <FriendItem friend={friend} key={i} />
                                    ))}
                                </ul>
                            ) : (
                                <div>
                                    <p>No friends to show</p>
                                    <p>Add some</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Friendbar;
