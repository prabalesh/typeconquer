function TypingInput({
    inputRef,
}: {
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    return (
        <div className="text-center">
            <input className="opacity-0 -z-50" ref={inputRef} type="text" />
        </div>
    );
}

export default TypingInput;
