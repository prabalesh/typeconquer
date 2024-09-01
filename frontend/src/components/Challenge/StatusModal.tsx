import React from "react";
import { StatusType } from "../../types";
import Spinner from "../Spinner";

interface ModalProps {
    status: StatusType;
    onClose: () => void;
}

const StatusModal: React.FC<ModalProps> = ({ status, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className={`fixed`} onClick={onClose}></div>
            <div
                className={`bg-[--highlighted-color]  p-6 rounded-lg shadow-lg max-w-sm mx-auto $} p-4`}
            >
                <p
                    className={`${
                        status.isFailure && "text-red-500"
                    } text-2xl my-4`}
                >
                    {status.message}
                </p>
                {status.isLoading && !status.isFailure ? (
                    <Spinner />
                ) : (
                    <button
                        className="mt-4 bg-[--accent-color] text-[--highlighted-text] px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default StatusModal;
