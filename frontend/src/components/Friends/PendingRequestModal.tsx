import React from "react";
import { PendingRequestType } from "./Friendbar";
import { toast } from "react-toastify";

interface PendingRequestsModalProps {
    pendingRequests: PendingRequestType[];
    onClose: () => void;
}

const PendingRequestsModal: React.FC<PendingRequestsModalProps> = ({
    pendingRequests,
    onClose,
}) => {
    const handleAcceptRequest = async (
        friendshipID: string,
        requesterID: string
    ) => {
        const apiURL = `${import.meta.env.VITE_API_URL}/api/friends/accept`;
        try {
            const res = await fetch(apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    friendshipID: friendshipID,
                    requesterID: requesterID,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to accept friend request");
            }
            const data = await res.json();
            if (data["success"]) {
                toast.success("Friend request accepted");
                setTimeout(() => onClose(), 2000);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to accept friend request");
        }
    };

    const handleRejectRequest = async (
        friendshipID: string,
        requesterID: string
    ) => {
        const apiURL = `${import.meta.env.VITE_API_URL}/api/friends/reject`;
        try {
            const res = await fetch(apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    friendshipID: friendshipID,
                    requesterID: requesterID,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to reject friend request");
            }
            const data = await res.json();
            if (data["success"]) {
                toast.success("Friend request rejected");
                setTimeout(() => onClose(), 2000);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to reject friend request");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative bg-[--highlighted-color] rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 md:mx-0">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[--highlighted-text] hover:text-[--button-hover] text-3xl"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Pending Requests
                </h2>

                {pendingRequests.length > 0 ? (
                    <ul className="space-y-2 bg-[--bg-color] text-[--highlighted-text]">
                        {pendingRequests.map((request, index) => (
                            <li
                                key={index}
                                className="p-3 rounded-md flex flex-col gap-2"
                            >
                                <div>
                                    <p>{request["requester"]["name"]}</p>
                                    <p>@{request["requester"]["username"]}</p>
                                </div>
                                <div className="flex gap-2 text-center">
                                    <div
                                        className="bg-green-500 hover:bg-green-700 w-1/2 rounded"
                                        onClick={() =>
                                            handleAcceptRequest(
                                                request._id.toString(),
                                                request.requester._id.toString()
                                            )
                                        }
                                    >
                                        Accept
                                    </div>
                                    <div
                                        className="bg-red-500 hover:bg-red-700 w-1/2 rounded"
                                        onClick={() =>
                                            handleRejectRequest(
                                                request._id.toString(),
                                                request.requester._id.toString()
                                            )
                                        }
                                    >
                                        Decline
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No pending requests.</p>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PendingRequestsModal;
