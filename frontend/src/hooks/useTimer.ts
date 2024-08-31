import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const useTimer = (isTyping: boolean) => {
    const { timeLimit } = useSelector((state: RootState) => state.typing);

    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [timesUp, setTimesUp] = useState<boolean>(false);
    const [pauseTime, setPauseTime] = useState<boolean>(false);

    useEffect(() => {
        setTimeLeft(timeLimit);
    }, [timeLimit]);

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
