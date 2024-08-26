import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function TypingDisplay({
    charRefs,
    charIndex,
    isCharCorrectWrong,
}: {
    charRefs: React.RefObject<(HTMLSpanElement | null)[]>;
    charIndex: number;
    isCharCorrectWrong: string[];
}) {
    const { paragraph } = useSelector((state: RootState) => state.typing);

    const text = paragraph.join("");

    const [lineLength, setLineLength] = useState(60);

    useEffect(() => {
        function updateLineLength() {
            const container = document.getElementById("typing-display");
            if (container) {
                const containerWidth = container.clientWidth;
                const charWidth = 16; // Adjust this value if necessary
                const newLineLength = Math.floor(containerWidth / charWidth);
                setLineLength(newLineLength);
            }
        }

        updateLineLength();
        window.addEventListener("resize", updateLineLength);

        return () => {
            window.removeEventListener("resize", updateLineLength);
        };
    }, []);

    const words = text.split(" ");

    const lines = useMemo(() => {
        const linesArray: string[] = [];
        let currentLine = "";

        words.forEach((word) => {
            if (
                (currentLine + (currentLine ? " " : "") + word).length <=
                lineLength
            ) {
                currentLine += (currentLine ? " " : "") + word;
            } else {
                linesArray.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) {
            linesArray.push(currentLine);
        }

        return linesArray;
    }, [words, lineLength]);

    const currentCharIndex = Math.min(charIndex, text.length - 1);
    let cumulativeLength = 0;
    let currentLineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        cumulativeLength += lines[i].length + 1;
        if (currentCharIndex < cumulativeLength) {
            currentLineIndex = i;
            break;
        }
    }

    const startLineIndex = Math.max(0, currentLineIndex - 1);

    const visibleLines = lines.slice(
        startLineIndex,
        startLineIndex + 3 // Display a fixed number of lines, adjust as needed
    );

    return (
        <div
            id="typing-display"
            className="tracking-widest leading-7 text-gray-600 overflow-hidden"
        >
            {visibleLines.map((line, lno) => {
                const lineStartIndex = lines
                    .slice(0, startLineIndex + lno)
                    .reduce((acc, curr) => acc + curr.length + 1, 0);

                return (
                    <div
                        key={lno}
                        className="flex justify-between"
                        style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
                    >
                        {line.split("").map((char, i) => {
                            const currentCharPosition = lineStartIndex + i;
                            return (
                                <span
                                    key={i}
                                    ref={(ele) => {
                                        if (charRefs.current) {
                                            charRefs.current[
                                                currentCharPosition
                                            ] = ele;
                                        }
                                    }}
                                    className={`text-sm sm:text-base md:text-2xl between-md-lg:text-lg lg:text-3xl ${
                                        isCharCorrectWrong[currentCharPosition]
                                    } ${
                                        charIndex === currentCharPosition
                                            ? "border-b-2 border-[var(--accent-color)]"
                                            : ""
                                    }`}
                                    style={{ whiteSpace: "pre" }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default TypingDisplay;
