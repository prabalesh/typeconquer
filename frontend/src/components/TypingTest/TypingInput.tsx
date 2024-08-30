function TypingInput({
    // handleInputChange,
    inputRef,
}: {
    // handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    return (
        <div className="text-center">
            <input className="opacity-0" ref={inputRef} type="text" />
        </div>
    );
}

export default TypingInput;
