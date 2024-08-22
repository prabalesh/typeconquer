import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function TypingDisplay({
    // paragraph,
    charRefs,
    charIndex,
    isCharCorrectWrong,
}: {
    // paragraph: string[];
    charRefs: React.RefObject<(HTMLSpanElement | null)[]>;
    charIndex: number;
    isCharCorrectWrong: string[];
}) {
    const { paragraph } = useSelector((state: RootState) => state.typing);

    return (
        <div className="tracking-widest leading-10 text-justify text-gray-500">
            {paragraph.map((char, i) => (
                <span
                    key={i}
                    ref={(ele) =>
                        charRefs.current
                            ? (charRefs.current[i] = ele)
                            : charRefs.current
                    }
                    className={`text-3xl ${isCharCorrectWrong[i]} ${
                        charIndex == i
                            ? "border-b-2 border-[var(--accent-color)]"
                            : ""
                    }`}
                >
                    {char}
                </span>
            ))}
        </div>
    );
}

export default TypingDisplay;
