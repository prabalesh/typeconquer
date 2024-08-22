import fs from "fs";

const rawData = fs.readFileSync(__dirname + "/wordBank.json", "utf-8");
const wordBank = JSON.parse(rawData);

export type Difficulty = "easy" | "medium" | "hard";

export interface ParagraphOptions {
    wordCount: number;
    difficulty: Difficulty;
    includeSymbols?: boolean;
    includeNumbers?: boolean;
}

const prepositions = [
    "in",
    "on",
    "at",
    "with",
    "by",
    "for",
    "from",
    "about",
    "under",
    "over",
];
const adjectives = [
    "big",
    "small",
    "happy",
    "sad",
    "fast",
    "slow",
    "bright",
    "dark",
    "hot",
    "cold",
];
const conjunctions = [
    "and",
    "but",
    "or",
    "nor",
    "so",
    "yet",
    "because",
    "although",
    "if",
    "unless",
];
const interjections = [
    "wow",
    "oops",
    "hey",
    "yay",
    "ugh",
    "oh",
    "ah",
    "hmm",
    "oh no",
    "yikes",
];

const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function getRandomElement<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error("Array cannot be empty");
    }
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

export default function generateParagraph({
    wordCount,
    difficulty = "medium",
    includeSymbols = false,
    includeNumbers = false,
}: ParagraphOptions): string[] {
    const words = wordBank[difficulty];
    const specialWordCount = Math.floor(wordCount * 0.4);
    const normalWordCount = wordCount - specialWordCount;

    const specialWords: string[] = [];
    const normalWords: string[] = [];

    for (let i = 0; i < specialWordCount; i++) {
        let word = "a";
        const type = Math.floor(Math.random() * 4);

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
        }

        specialWords.push(word);
    }

    while (normalWords.length < normalWordCount) {
        let word: string = getRandomElement(words);
        if (includeSymbols && Math.random() < 0.2) {
            word += getRandomElement(symbols);
        }
        if (includeNumbers && Math.random() < 0.2) {
            word += getRandomElement(numbers);
        }
        normalWords.push(word);
    }

    const allWords = [...specialWords, ...normalWords];
    const shuffledWords = shuffleArray(allWords);

    const paragraphArr: string[] = [];
    let capitalizeNext = true;

    for (const word of shuffledWords) {
        if (includeSymbols && Math.random() < 0.1) {
            if (paragraphArr.length > 0) {
                paragraphArr.pop();
            }
            paragraphArr.push(getRandomElement(wordBank["easy"]) + ". ");
            capitalizeNext = true;
        }
        if (includeSymbols && Math.random() < 0.1) {
            if (paragraphArr.length > 0) {
                paragraphArr.pop();
            }
            paragraphArr.push(getRandomElement(wordBank["medium"]) + ", ");
            capitalizeNext = true;
        }
        if (capitalizeNext) {
            paragraphArr.push(capitalizeFirstLetter(word));
            capitalizeNext = false;
        } else {
            paragraphArr.push(word);
        }
        paragraphArr.push(" ");
    }

    const finalParagraph = capitalizeFirstLetter(paragraphArr.join("").trim());

    return finalParagraph.split("");
}
