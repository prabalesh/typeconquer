import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { toast } from "react-toastify";

interface FriendRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FriendRequestModal: React.FC<FriendRequestModalProps> = ({
    isOpen,
    onClose,
}) => {
    const user = useSelector((state: RootState) => state.user);

    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSendRequest = async (username: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const apiURL = `${
                import.meta.env.VITE_API_URL
            }/api/friends/request`;
            const res = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username }),
            });

            if (!res.ok) {
                throw new Error("Failed to send friend request");
            }
            const data = await res.json();

            if (data["success"]) {
                setSuccess(data["message"]);
                toast.success(data["message"]);
            } else {
                setError(data["message"]);
                toast.error(data["message"]);
            }

            setUsername("");
            setTimeout(onClose, 2000);
        } catch (error: unknown) {
            console.log(error);
            setError("Failed to send friend request");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (user.id) {
            handleSendRequest(username);
        } else {
            toast.error("Login required to send friend request");
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="relative bg-[--bg-color] p-6 rounded-lg shadow-lg w-full max-w-md">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[--highlighted-text] hover:text-[--button-hover] text-3xl"
                    >
                        &times;
                    </button>
                    <h2 className="text-lg font-semibold mb-4 text-center text-[var(--heading-color)]">
                        Send Friend Request
                    </h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && (
                        <p className="text-green-500 mb-4">{success}</p>
                    )}
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <input
                            type="text"
                            id="receiverId"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-none px-4 py-2 w-full mb-4 rounded-3xl text-gray-800"
                            required
                            placeholder="username"
                        />
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-[--button-hover] text-[--button-hover-text] rounded-3xl py-2 px-4 ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {loading ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FriendRequestModal;
