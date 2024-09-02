import { useEffect } from "react";
import { Link } from "react-router-dom";

const WinnerModal = ({
    isOpen,
    onClose,
    wpm,
    accurracy,
    challengerWPM,
    challengerAccuracy,
    defeat,
}: {
    isOpen: boolean;
    onClose: () => void;
    wpm: number;
    accurracy: number;
    challengerWPM: number;
    challengerAccuracy: number;
    defeat: boolean;
}) => {
    const createConfetti = () => {
        const confettiContainer = document.createElement("div");
        confettiContainer.classList.add("confetti");
        document.body.appendChild(confettiContainer);

        const colors = ["#FF5733", "#33FF57", "#3357FF", "#F0F0F0"];

        for (let i = 0; i < 100; i++) {
            const confettiPiece = document.createElement("div");
            confettiPiece.classList.add("confetti-piece");
            confettiPiece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            confettiPiece.style.width = `${Math.random() * 10 + 5}px`;
            confettiPiece.style.height = `${Math.random() * 10 + 5}px`;
            confettiPiece.style.top = `${Math.random() * 100}vh`;
            confettiPiece.style.left = `${Math.random() * 100}vw`;
            confettiPiece.style.animationDuration = `${Math.random() * 2 + 3}s`;
            confettiContainer.appendChild(confettiPiece);
        }

        // Remove confetti container after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    };

    useEffect(() => {
        if (!defeat) createConfetti();
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50">
            <div className="fixed " onClick={onClose} />
            <div className="p-8 rounded-lg shadow-lg text-center animated-border shake bg-[var(--bg-color)] relative z-10">
                <h2 className="text-2xl font-bold mb-4">
                    {defeat ? (
                        <p className="text-red-500">Defeated 😔</p>
                    ) : (
                        <p className="text-green-500">Congratulations! 🥳</p>
                    )}
                </h2>
                <p>
                    Your WPM: {wpm}, Your accuracy: {accurracy}
                </p>
                <p>
                    Challenger's WPM: {challengerWPM}, Challenger's accuracy:{" "}
                    {challengerAccuracy}%
                </p>
                <p className="text-center">
                    <Link
                        to={"/challenges"}
                        className="underline text-blue-500"
                    >
                        Click here
                    </Link>{" "}
                    to see all your challenges
                </p>
                <button
                    className="my-4 py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default WinnerModal;
