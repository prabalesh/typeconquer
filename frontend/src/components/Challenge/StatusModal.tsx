import React from "react";
import { StatusType } from "../../types";
import Spinner from "../Spinner";

interface ModalProps {
    status: StatusType;
    onClose: () => void;
}

const StatusModal: React.FC<ModalProps> = ({ status, onClose }) => {
    if (status.isSuccess) {
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className={`fixed`} onClick={onClose}></div>
            <div
                className={`bg-[--highlighted-color]  p-6 rounded-lg shadow-lg max-w-sm mx-auto $} p-4`}
            >
                <p
                    className={`${
                        status.isFailure && "text-red-500"
                    } text-2xl mb-4`}
                >
                    {status.message}
                </p>
                {status.isLoading && !status.isFailure ? (
                    <Spinner />
                ) : (
                    <button
                        className="mt-4 py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
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
