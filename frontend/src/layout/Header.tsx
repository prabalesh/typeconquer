import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useLogout } from "../hooks/useLogout";

const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [isModalOpen, setModalOpen] = useState(false);
    const logout = useLogout();

    const handleLogout = () => {
        logout();
        setModalOpen(false);
    };

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
            <div className="flex space-x-2 sm:space-x-4 items-center">
                {user && user.email ? (
                    <>
                        <div
                            className="relative cursor-pointer"
                            onClick={() => setModalOpen(!isModalOpen)}
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt="Profile"
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                        </div>

                        {isModalOpen && (
                            <div
                                className="flex flex-col gap-2 absolute top-20 right-4 w-56 sm:w-64 bg-[var(--bg-color)] shadow-lg rounded-lg p-4 z-50 bordered-1"
                                style={{ minWidth: "200px" }}
                            >
                                <div className="flex gap-4 pb-2 items-center">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                        alt="Profile"
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                    />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold truncate">
                                            {user.name}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm truncate">{user.email}</p>
                                <button
                                    onClick={handleLogout}
                                    className="mt-4 w-full bg-red-500 text-white py-2 rounded bordered button transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Link
                            to={"/auth/login"}
                            className="bg-[var(--primary-color)] text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded hover:bg-opacity-90 hover:text-[var(--text-color)] transition-all"
                        >
                            Login
                        </Link>
                        <Link
                            to={"/auth/register"}
                            className="bg-[var(--secondary-color)] text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded hover:bg-opacity-90 hover:text-[var(--text-color)] transition-all"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
