import { useState, useEffect } from "react";

const useTypingStats = (
    charIndex: number,
    mistakes: number,
    isTyping: boolean,
    startTime: number | null,
    timeLeft: number
) => {
    const [wpm, setWpm] = useState<number>(0);
    const [cpm, setCpm] = useState<number>(0);

    useEffect(() => {
        if (startTime && isTyping) {
            const correctChars = charIndex - mistakes;
            const currentTime = new Date().getTime();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);

            const totalTime = elapsedTime;

            if (totalTime > 0) {
                setCpm(Math.floor(correctChars * (60 / totalTime)));
                setWpm(Math.round((correctChars / 5 / totalTime) * 60));
            } else {
                setCpm(0);
                setWpm(0);
            }
        }
    }, [charIndex, mistakes, isTyping, startTime, timeLeft]);
    return [wpm, cpm] as const;
};

export default useTypingStats;
