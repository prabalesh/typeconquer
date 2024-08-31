import React from "react";

interface ModalProps {
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className={`fixed inset-0 bg-black opacity-50`}
                onClick={onClose}
            ></div>
            <div
                className={`bg-[--highlighted-color]  p-6 rounded-lg shadow-lg max-w-sm mx-auto $}`}
            >
                <p>{message}</p>
                <button
                    className="mt-4 bg-[--accent-color] text-[--highlighted-text] px-4 py-2 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
