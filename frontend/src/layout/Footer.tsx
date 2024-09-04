import React, { useEffect, useState } from "react";
import ThemeSelector from "./ThemeSelector";

const Footer: React.FC = () => {
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
        <footer
            className="bg-footer-background text-footer-text py-4 sm:py-6 md:py-8"
            style={{ height: "10vh", minHeight: "60px" }}
        >
            <div className="container mx-auto px-2 flex justify-center gap-4">
                <ThemeSelector border={true} />
                <select
                    value={selectedFont}
                    onChange={handleFontChange}
                    className="px-4 py-2 border bg-[--bg-color] border-[var(--border-color)] rounded-3xl"
                >
                    <option value="Space Mono" className="">
                        Space Mono
                    </option>
                    <option value="Poppins">Poppins</option>
                </select>
            </div>
        </footer>
    );
};

export default Footer;
