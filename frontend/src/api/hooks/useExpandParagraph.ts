import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setParagraph } from "../../features/typing/typingSlice";

export const useExpandParagraph = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { difficulty, includeSymbols, includeNumbers, paragraph } =
        useSelector((state: RootState) => state.typing);

    const expandParagraph = useCallback(async () => {
        const res = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/api/generate-paragraph?difficulty=${difficulty}&includeSymbols=${includeSymbols}&includeNumbers=${includeNumbers}`
        );
        if (!res.ok) {
            return;
        }

        const data = await res.json();
        if (typeof data === "object" && "words" in data) {
            const words: string = data.words as string;
            const newParagraph = [...paragraph, ...words.split("")];
            dispatch(setParagraph(newParagraph));
        }
    }, [dispatch, difficulty, includeSymbols, includeNumbers, paragraph]);

    return { expandParagraph };
};
