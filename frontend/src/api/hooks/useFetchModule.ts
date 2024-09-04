import { useEffect, useState } from "react";
import { Module } from "../../types";

function useFetchModule(moduleSlug: string | undefined) {
    const [moduleLoading, setLoading] = useState<boolean>(true);
    const [module, setModule] = useState<Module | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            if (!moduleSlug) {
                return;
            }

            const apiURL = `${
                import.meta.env.VITE_API_URL
            }/api/learning/modules/${moduleSlug}`;
            setLoading(true);
            try {
                const res = await fetch(apiURL);
                const data = await res.json();
                if (data["success"]) {
                    setModule(data.module);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [moduleSlug]);

    return { moduleLoading, module };
}

export default useFetchModule;
