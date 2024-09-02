import TypingTest from "../components/TypingTest/TypingTest";
import Spinner from "../components/Spinner";
import useGenerateParapgraph from "../api/hooks/useFetchParagraph";

export type Difficulty = "easy" | "medium" | "hard";

function Home() {
    const { isLoading, error, generateParagraph } = useGenerateParapgraph();

    return (
        <div className="flex justify-center items-center h-full px-4 sm:px-6 md:px-8">
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <div className="text-center">
                    <p className="text-red-500">Error: {error}</p>

                    <button
                        onClick={generateParagraph}
                        className="mt-8 py-2 px-4 sm:py-2 sm:px-6 border shadow-md rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <TypingTest handleGenerateParagraph={generateParagraph} />
            )}
        </div>
    );
}

export default Home;
