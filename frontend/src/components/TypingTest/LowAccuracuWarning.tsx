export default function LowAccurarcyWarning({
    resetGame,
    accuracy,
}: {
    resetGame: () => void;
    accuracy: string;
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity- z-50">
            <div className="p-8 rounded-lg shadow-lg text-center animated-border shake bg-[var(--bg-color)]">
                <h2 className="text-2xl font-bold mb-4">Warning!</h2>
                <p className="text-lg">Very low accuracu</p>
                <p>
                    You're making a lot of mistakes while typing. Type by making
                    less mistakes
                </p>
                <p>Your accuracy: {accuracy}%</p>
                <button
                    className="my-4 py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                    onClick={resetGame}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
