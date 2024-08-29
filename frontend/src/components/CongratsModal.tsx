const CongratsModal = ({
    isOpen,
    onClose,
    wpm,
    prevBestWpm,
}: {
    isOpen: boolean;
    onClose: () => void;
    wpm: number;
    prevBestWpm: number;
}) => {
    if (!isOpen) return null;

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
    createConfetti();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity- z-50">
            <div className="p-8 rounded-lg shadow-lg text-center animated-border shake bg-[var(--bg-color)]">
                <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                <p className="text-lg">
                    You've achieved the best WPM of {wpm}!
                </p>
                <p>Previous best: {prevBestWpm} wpm</p>
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

export default CongratsModal;
