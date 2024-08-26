import { useCallback, useEffect, useState } from "react";
import TypingTest from "../components/TypingTest/TypingTest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { setParagraph } from "../features/typing/typingSlice";

export type Difficulty = "easy" | "medium" | "hard";

function Home() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { difficulty, includeSymbols, includeNumbers } = useSelector(
        (state: RootState) => state.typing
    );

    const handleGenerateParagraph = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/generate-paragraph?difficulty=${difficulty}&includeSymbols=${includeSymbols}&includeNumbers=${includeNumbers}`
            );
            if (!res.ok) {
                throw new Error("Failed to fetch paragraph");
            }

            const data = await res.json();
            dispatch(setParagraph(data.words));

            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [difficulty, dispatch, includeNumbers, includeSymbols]);

    useEffect(() => {
        handleGenerateParagraph();
    }, [difficulty, includeSymbols, includeNumbers, handleGenerateParagraph]);

    return (
        <div className="flex justify-center items-center h-full px-4 sm:px-6 md:px-8">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <div className="text-center">
                    <p className="text-red-500">Error: {error}</p>

                    <button
                        onClick={handleGenerateParagraph}
                        className="mt-8 py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <TypingTest handleGenerateParagraph={handleGenerateParagraph} />
            )}
        </div>
    );
}

export default Home;
