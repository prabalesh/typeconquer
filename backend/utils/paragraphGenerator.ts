export type Difficulty = "easy" | "medium" | "hard";

export interface ParagraphOptions {
    wordCount: number;
    difficulty: Difficulty;
    includeSymbols?: boolean;
    includeNumbers?: boolean;
    chunkSize?: number;
}

const prepositions: string[] = ["in", "on", "at", "with", "by"];
const adjectives: string[] = ["big", "small", "happy", "sad"];
const conjunctions: string[] = ["and", "but", "or", "nor"];
const interjections: string[] = ["wow", "oops", "hey", "yay"];
const symbols: string[] = ["!", "@", "#", "$", "%"];
const numbers: string[] = ["0", "1", "2", "3", "4"];

async function getWordsForDifficulty(
    difficulty: Difficulty
): Promise<string[]> {
    switch (difficulty) {
        case "easy":
            return (await import("./wordBankEasy")).wordBankEasy;
        case "medium":
            return (await import("./wordBankMedium")).wordBankMedium;
        case "hard":
            return (await import("./wordBankHard")).wordBankHard;
        default:
            throw new Error("Invalid difficulty level");
    }
}

function getChunk<T>(arr: T[], chunkSize: number): T[] {
    const start = Math.floor(Math.random() * (arr.length - chunkSize));
    return arr.slice(start, start + chunkSize);
}

export default async function generateParagraph({
    wordCount,
    difficulty = "medium",
    includeSymbols = false,
    includeNumbers = false,
    chunkSize = 10,
}: ParagraphOptions): Promise<string> {
    const words: string[] = await getWordsForDifficulty(difficulty);

    const wordChunk: string[] = getChunk(words, chunkSize);

    const specialWordCount = Math.floor(wordCount * 0.4);
    const normalWordCount = wordCount - specialWordCount;

    const specialWords: string[] = [];
    const normalWords: string[] = [];

    for (let i = 0; i < specialWordCount; i++) {
        const type = Math.floor(Math.random() * 4);
        let word: string;

        switch (type) {
            case 0:
                word = getRandomElement(prepositions);
                break;
            case 1:
                word = getRandomElement(adjectives);
                break;
            case 2:
                word = getRandomElement(conjunctions);
                break;
            case 3:
                word = getRandomElement(interjections);
                if (includeSymbols) {
                    word += getRandomElement(symbols);
                }
                break;
            default:
                word = "";
        }

        specialWords.push(word);
    }

    while (normalWords.length < normalWordCount) {
        let word: string = getRandomElement(wordChunk);
        if (includeSymbols && Math.random() < 0.2) {
            word += getRandomElement(symbols);
        }
        if (includeNumbers && Math.random() < 0.2) {
            word += getRandomElement(numbers);
        }
        normalWords.push(word);
    }

    const allWords: string[] = [...specialWords, ...normalWords];
    const shuffledWords: string[] = shuffleArray(allWords);

    const paragraphArr: string[] = [];
    let capitalizeNext = true;

    for (const word of shuffledWords) {
        if (capitalizeNext) {
            paragraphArr.push(capitalizeFirstLetter(word));
            capitalizeNext = false;
        } else {
            paragraphArr.push(word);
        }
        paragraphArr.push(" ");
    }

    const finalParagraph: string = capitalizeFirstLetter(
        paragraphArr.join("").trim()
    );

    return finalParagraph;
}

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
