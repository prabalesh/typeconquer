export default function TypingStats({
    timeLeft,
    wpm,
    resetGame,
}: {
    timeLeft: number;
    wpm: number;
    resetGame: (() => void) | null;
}) {
    return (
        <div className="mt-8 flex flex-col font-bold text-[var(--text-color)]">
            <div className="flex lg:flex-row gap-8 lg:text-xl sm:text-sm justify-center items-center">
                <p className="text-center">
                    <span className={`${timeLeft < 5 && "text-red-500"}`}>
                        {timeLeft}s
                    </span>{" "}
                </p>
                <p className="text-center">
                    <span>{wpm}</span> WPM
                </p>
                {resetGame && (
                    <div className="flex justify-center">
                        <button onClick={resetGame}>
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
