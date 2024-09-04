import { useEffect, useState } from "react";
import { Lesson } from "../../types";

function useFetchLesson(lessonSlug: string | undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            if (!lessonSlug) {
                setError("Invalid lesson");
                return;
            }

            const apiURL = `${
                import.meta.env.VITE_API_URL
            }/api/learning/lessons/${lessonSlug}`;
            setLoading(true);
            try {
                const res = await fetch(apiURL);
                const data = await res.json();
                if (data["success"]) {
                    setLesson(data.lesson);
                } else {
                    setError(data.message);
                }
            } catch {
                setError("Error fetching lesson");
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonSlug]);

    return { loading, error, lesson };
}

export default useFetchLesson;
