import { useEffect, useState } from "react";
import { Module } from "../../types";

function useFetchModules() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModules = async () => {
            const apiURL = `${import.meta.env.VITE_API_URL}/api/learning`;
            try {
                const res = await fetch(apiURL);

                const data = await res.json();
                if (data["success"]) {
                    setModules(data["modules"]);
                } else {
                    setError("Failed to fetch modules");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    return {
        loading,
        error,
        modules,
    };
}

export default useFetchModules;
