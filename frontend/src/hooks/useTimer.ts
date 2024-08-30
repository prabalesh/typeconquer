import { useState, useEffect } from "react";

const useTimer = (isTyping: boolean, timeLimit: number) => {
    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [timesUp, setTimesUp] = useState<boolean>(false);
    const [pauseTime, setPauseTime] = useState<boolean>(false);

    useEffect(() => {
        if (timeLeft > 0 && !pauseTime && isTyping) {
            const intervalId = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else if (timeLeft == 0) {
            setTimesUp(true);
        }
    }, [isTyping, timeLeft, pauseTime]);

    return [timeLeft, timesUp, setTimeLeft, setTimesUp, setPauseTime] as const;
};

export default useTimer;
