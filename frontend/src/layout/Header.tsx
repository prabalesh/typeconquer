import React from "react";
import ThemeSelector from "./ThemeSelector";

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between px-8 py-5">
            <h1 className="text-2xl font-bold text-[var(--heading-color)]">
                TypeConquer
            </h1>
            <ThemeSelector />
        </header>
    );
};

export default Header;
