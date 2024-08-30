export default function TypingStats({
    timeLeft,
    wpm,
    cpm,
    resetGame,
}: {
    timeLeft: number;
    wpm: number;
    cpm: number;
    resetGame: (() => void) | null;
}) {
    return (
        <div className="mt-8 flex flex-col font-bold text-[var(--text-color)]">
            <div className="flex lg:flex-row gap-8 lg:text-xl sm:text-sm justify-center">
                <p className="text-center">
                    <span className={`${timeLeft < 5 && "text-red-500"}`}>
                        {timeLeft}s
                    </span>{" "}
                </p>
                <p className="text-center">
                    <span>{wpm}</span> WPM
                </p>
                <p className="text-center">
                    <span>{cpm}</span> CPM
                </p>
            </div>
            {resetGame && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={resetGame}
                        className="py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    );
}
