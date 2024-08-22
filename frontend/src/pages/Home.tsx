import { useCallback, useEffect, useState } from "react";
import TypingTest from "../components/TypingTest/TypingTest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { setParagraph } from "../features/typing/typingSlice";

export type Difficulty = "easy" | "medium" | "hard";

function Home() {
    // const [paragraph, setParagraph] = useState<string[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    // const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    // const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);

    // dispatch
    const dispatch = useDispatch<AppDispatch>();
    const { difficulty, includeSymbols, includeNumbers } = useSelector(
        (state: RootState) => state.typing
    );

    const handleGenerateParagraph = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `http://localhost:3000/?difficulty=${difficulty}&includeSymbols=${includeSymbols}&includeNumbers=${includeNumbers}`
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
    }, [difficulty, includeNumbers, includeSymbols]);

    useEffect(() => {
        handleGenerateParagraph();
    }, [difficulty, includeSymbols, includeNumbers, handleGenerateParagraph]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : (
                <TypingTest
                    // paragraph={paragraph}
                    handleGenerateParagraph={handleGenerateParagraph}
                    // difficulty={difficulty}
                    // setDifficulty={setDifficulty}
                    // includeSymbols={includeSymbols}
                    // setIncludeSymbols={setIncludeSymbols}
                    // includeNumbers={includeNumbers}
                    // setIncludeNumbers={setIncludeNumbers}
                />
            )}
        </div>
    );
}

export default Home;
