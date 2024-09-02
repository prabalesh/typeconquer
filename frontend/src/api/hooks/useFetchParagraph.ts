import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setParagraph } from "../../features/typing/typingSlice";

const useGenerateParapgraph = () => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { difficulty, includeNumbers, includeSymbols } = useSelector(
        (state: RootState) => state.typing
    );

    const generateParagraph = useCallback(async () => {
        try {
            const apiURL = `${
                import.meta.env.VITE_API_URL
            }/api/generate-paragraph?difficulty=${difficulty}&includeSymbols=${includeSymbols}&includeNumbers=${includeNumbers}`;

            setIsLoading(true);
            const res = await fetch(apiURL, { credentials: "include" });
            if (!res.ok) {
                throw new Error("Failed to fetch paragraph");
            }

            const data = await res.json();
            dispatch(setParagraph(data.words.split("")));

            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }, [difficulty, dispatch, includeNumbers, includeSymbols]);

    useEffect(() => {
        generateParagraph();
    }, [generateParagraph]);

    return { isLoading, error, generateParagraph };
};

export default useGenerateParapgraph;
