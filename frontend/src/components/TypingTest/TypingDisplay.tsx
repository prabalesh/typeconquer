import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function TypingDisplay({
    charIndex,
    isCharCorrectWrong,
    inputRef,
}: {
    charIndex: number;
    isCharCorrectWrong: string[];
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [lineLength, setLineLength] = useState(60);

    const [textAlign, setTextAlign] = useState(() => {
        const savedTextAlign = localStorage.getItem("textAlign");
        return savedTextAlign
            ? savedTextAlign
            : savedTextAlign === ""
            ? ""
            : "justify-around";
    });

    useEffect(() => {
        localStorage.setItem("textAlign", textAlign);
    }, [textAlign]);

    useEffect(() => {
        function checkIfMobile() {
            const userAgent = navigator.userAgent || navigator.vendor;
            const isMobileDevice =
                /android|iPad|iPhone|iPod/.test(userAgent) ||
                window.innerWidth <= 800;
            setIsMobile(isMobileDevice);
        }

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) {
            function updateLineLength() {
                const container = document.getElementById("typing-display");
                if (container) {
                    const containerWidth = container.clientWidth;
                    const charWidth = 16;
                    const newLineLength = Math.floor(
                        containerWidth / charWidth
                    );
                    setLineLength(newLineLength);
                }
            }

            updateLineLength();
            window.addEventListener("resize", updateLineLength);

            return () => {
                window.removeEventListener("resize", updateLineLength);
            };
        }
    }, [isMobile]);

    const { paragraph } = useSelector((state: RootState) => state.typing);
    const text = paragraph.join("");

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
    const visibleLines = lines.slice(startLineIndex, startLineIndex + 3);

    return (
        <div
            id="typing-display"
            className="tracking-widest text-gray-600"
            style={{
                width: isMobile ? "100%" : "auto",
                maxHeight: isMobile ? "calc(100vh - 80px)" : "auto",
                overflow: isMobile ? "auto" : "hidden",
                padding: isMobile ? "10px" : "0",
            }}
            onClick={() => inputRef.current?.focus()}
        >
            {!isMobile && (
                <div className="flex justify-center gap-4">
                    <div
                        className={`p-2 ${
                            textAlign === "" && "text-[var(--text-color)]"
                        }`}
                        onClick={() => setTextAlign("")}
                    >
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                    <div
                        className={`p-2 ${
                            textAlign === "justify-center" &&
                            "text-[var(--text-color)]"
                        }`}
                        onClick={() => setTextAlign("justify-center")}
                    >
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M4 6h16M6 12h12M4 18h16"
                            />
                        </svg>
                    </div>
                    <div
                        className={`p-2 ${
                            textAlign === "justify-around" &&
                            "text-[var(--text-color)]"
                        }`}
                        onClick={() => setTextAlign("justify-around")}
                    >
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M4 6v12M20 6v12"
                            />
                        </svg>
                    </div>
                </div>
            )}

            {visibleLines.map((line, lno) => {
                const lineStartIndex = lines
                    .slice(0, startLineIndex + lno)
                    .reduce((acc, curr) => acc + curr.length + 1, 0);

                return (
                    <div
                        key={lno}
                        className={`flex ${
                            !isMobile &&
                            paragraph.length - charIndex > 130 &&
                            textAlign
                        }`}
                        style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
                    >
                        {line.split("").map((char, i) => {
                            const currentCharPosition = lineStartIndex + i;
                            return (
                                <span
                                    key={i}
                                    className={`text-sm sm:text-base md:text-2xl between-md-lg:text-lg lg:text-3xl ${
                                        isCharCorrectWrong[currentCharPosition]
                                    } ${
                                        charIndex === currentCharPosition
                                            ? "cur-cursor"
                                            : ""
                                    }`}
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
