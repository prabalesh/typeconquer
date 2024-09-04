import { useSelector } from "react-redux";

const usefetchParagrph = async () => {
    const dispatch = useSelector();

    const res = await fetch(
        `${
            import.meta.env.VITE_API_URL
        }/api/generate-paragraph?difficulty=${difficulty}&includeSymbols=${includeSymbols}&includeNumbers=${includeNumbers}`,
        { credentials: "include" }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch paragraph");
    }

    const data = await res.json();
    dispatch(setParagraph(data.words.split("")));
};

export default usefetchParagrph;
