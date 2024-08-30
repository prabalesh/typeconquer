import { useState, useRef, useEffect } from "react";

const themes = ["light", "dark", "purple"];

function ThemeSelector({ border }: { border: boolean }) {
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
        <div>
            <button
                onClick={toggleDropdown}
                className={`px-2 ${
                    border &&
                    "border rounded-3xl border-[var(--border-color)] bg-[var(--button-bg)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)]"
                } text-[var(--button-text)] text-sm sm:text-base`}
            >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{
                        background: "rgba(0, 0, 0, 0.6)",
                    }}
                >
                    <div className="absolute inset-0 bg-transparent backdrop-blur-md"></div>
                    <div
                        ref={dropdownRef}
                        className="relative z-10 w-1/2 max-w-md bg-[var(--bg-color)] shadow-lg rounded-md p-4 mx-4 sm:mx-auto"
                        style={{}}
                    >
                        <h2 className="text-center text-xl font-semibold text-[var(--text-color)]">
                            Select Theme
                        </h2>
                        <div className="py-1 text-center">
                            {themes.map((themeOption) => (
                                <button
                                    key={themeOption}
                                    onClick={() =>
                                        handleThemeChange(themeOption)
                                    }
                                    className="block text-center w-full py-2 text-[var(--text-color)] hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)] text-sm sm:text-base"
                                >
                                    {themeOption.charAt(0).toUpperCase() +
                                        themeOption.slice(1)}{" "}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThemeSelector;
