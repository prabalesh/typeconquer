import { useState } from "react";

function TypingInput({
    inputRef,
}: {
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    const [input, setInput] = useState("");

    return (
        <div className="text-center">
            <input
                className="opacity-0"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
}

export default TypingInput;
