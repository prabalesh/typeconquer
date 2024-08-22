import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const useTimer = (isTyping: boolean) => {
    //redux
    const { timeLimit } = useSelector((state: RootState) => state.typing);

    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [timesUp, setTimesUp] = useState<boolean>(false);

    useEffect(() => {
        if (timeLeft > 0 && isTyping) {
            const intervalId = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else if (timeLeft == 0) {
            setTimesUp(true);
        }
    }, [isTyping, timeLeft]);

    return [timeLeft, timesUp, setTimeLeft, setTimesUp] as const;
};

export default useTimer;
