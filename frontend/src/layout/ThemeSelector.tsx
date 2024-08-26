import React, { useState, useRef, useEffect } from "react";

const themes = ["light", "dark", "purple"];

const ThemeSelector: React.FC = () => {
    const [theme, setTheme] = useState<string>(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme || "light";
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleThemeChange = (selectedTheme: string) => {
        setTheme(selectedTheme);
        document.body.className = `theme-${selectedTheme}`;
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.body.className = `theme-${savedTheme}`;
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = `theme-${theme}`;
    }, [theme]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="inline-flex justify-center w-full rounded-3xl border border-[var(--border-color)] bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)] p-2 text-sm sm:text-base"
            >
                {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
            </button>
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 z-10 w-full sm:w-48 origin-bottom-right rounded-md shadow-lg bg-[var(--bg-color)] ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {themes.map((themeOption) => (
                            <button
                                key={themeOption}
                                onClick={() => handleThemeChange(themeOption)}
                                className="block px-4 py-2 text-[var(--text-color)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)] w-full text-left text-sm sm:text-base"
                            >
                                {themeOption.charAt(0).toUpperCase() +
                                    themeOption.slice(1)}{" "}
                                Theme
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
