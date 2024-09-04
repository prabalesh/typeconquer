import { useState, useEffect } from "react";

const useTypingStats = (
    charIndex: number,
    mistakes: number,
    isTyping: boolean,
    startTime: number | null,
    timeLeft: number
) => {
    const [wpm, setWpm] = useState<number>(0);

    useEffect(() => {
        if (startTime && isTyping) {
            const correctChars = charIndex - mistakes;
            const currentTime = new Date().getTime();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);

            const totalTime = elapsedTime;

            if (totalTime > 0) {
                setWpm(Math.round((correctChars / 5 / totalTime) * 60));
            } else {
                setWpm(0);
            }
        }
    }, [charIndex, mistakes, isTyping, startTime, timeLeft]);
    return [wpm] as const;
};

export default useTypingStats;
