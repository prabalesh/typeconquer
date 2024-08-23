import React from "react";

const Header: React.FC = () => {
    return (
        <header
            className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5"
            style={{ height: "10vh" }}
        >
            <h1 className="text-xl font-bold text-[var(--heading-color)] sm:text-2xl md:text-3xl">
                TypeConquer
            </h1>
        </header>
    );
};

export default Header;
