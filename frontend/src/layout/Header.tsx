import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    return (
        <header
            className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5"
            style={{ height: "10vh", minHeight: "60px" }}
        >
            <Link to={"/"}>
                <h1 className="text-lg font-bold text-[var(--heading-color)] sm:text-xl md:text-2xl lg:text-3xl">
                    TypeConquer
                </h1>
            </Link>
            <div className="flex space-x-2 sm:space-x-4">
                <Link
                    to={"/auth/login"}
                    className="bg-[var(--primary-color)] text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded hover:bg-opacity-90 hover:text-[var(--text-color)] transition"
                >
                    Login
                </Link>
                <Link
                    to={"/auth/register"}
                    className="bg-[var(--secondary-color)] text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded hover:bg-opacity-90 hover:text-[var(--text-color)] transition"
                >
                    Register
                </Link>
            </div>
        </header>
    );
};

export default Header;
