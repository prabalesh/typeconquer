function TypingInput({
    inputRef,
}: {
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    return (
        <div className="text-center">
            <input className="opacity-0" ref={inputRef} type="text" />
        </div>
    );
}

export default TypingInput;
