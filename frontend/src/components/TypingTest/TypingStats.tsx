export default function TypingStats({
    timeLeft,
    wpm,
    cpm,
    resetGame,
}: {
    timeLeft: number;
    wpm: number;
    cpm: number;
    resetGame: () => void;
}) {
    return (
        <div className="mt-8 flex justify-center gap-8 text-xl font-bold text-[var(--text-color)]">
            <p>{timeLeft} s</p>
            <p>{wpm} WPM</p>
            <p>{cpm} CPM</p>
            <button
                onClick={resetGame}
                className="py-1 px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
            >
                Try again
            </button>
        </div>
    );
}
