import { useEffect, useState } from "react";

function TypingInput({
    handleInputChange,
    inputRef,
}: {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        inputRef?.current?.focus();
    });

    return (
        <input
            className="opacity-0"
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => {
                setInputText(e.target.value);
                handleInputChange(e);
            }}
        />
    );
}

export default TypingInput;
