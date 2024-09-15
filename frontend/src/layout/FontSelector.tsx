import { useEffect, useState } from "react";

function FontSelector() {
    const [selectedFont, setSelectedFont] = useState<string>("Space Mono");

    useEffect(() => {
        const savedFont = localStorage.getItem("preferredFont") || "Space Mono";
        setSelectedFont(savedFont);
        document.body.style.fontFamily =
            savedFont === "Space Mono"
                ? "Space Mono, monospace"
                : "Poppins, sans-serif";
    }, []);

    const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFont = event.target.value;
        setSelectedFont(newFont);
        localStorage.setItem("preferredFont", newFont);
        document.body.style.fontFamily =
            newFont === "Space Mono"
                ? "Space Mono, monospace"
                : "Poppins, sans-serif";
    };
    return (
        <div>
            <select
                value={selectedFont}
                onChange={handleFontChange}
                className="px-2 py-1 rounded-3xl border bg-[--bg-color] border-[var(--border-color)]"
            >
                <option value="Space Mono" className="">
                    Space Mono
                </option>
                <option value="Poppins">Poppins</option>
            </select>
        </div>
    );
}

export default FontSelector;
