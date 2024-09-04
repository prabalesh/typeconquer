export function generateTextContent(
    chars: string,
    length: number,
    maxLength: number
): string {
    if (length <= 0) {
        throw new Error("Length must be a positive number.");
    }

    if (chars.length === 0) {
        throw new Error("Character string cannot be empty.");
    }

    if (maxLength <= 0) {
        throw new Error("Maximum word length must be a positive number.");
    }

    let paragraph = "";
    const charsLength = chars.length;

    while (paragraph.length < length) {
        const wordLength = Math.floor(Math.random() * maxLength) + 1;
        let word = "";

        while (word.length < wordLength) {
            const nextChar = chars.charAt(
                Math.floor(Math.random() * charsLength)
            );
            if (
                nextChar !== " " ||
                (word.length > 0 && word[word.length - 1] !== " ")
            ) {
                word += nextChar;
            }
        }

        if (paragraph.length + word.length + 1 <= length) {
            if (paragraph.length > 0) {
                paragraph += " ";
            }
            paragraph += word;
        } else {
            break;
        }
    }

    return paragraph.substring(0, length).trim();
}
