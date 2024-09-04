import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useLogout } from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import Sidebar from "../components/SideBar";
import { siderbarOpen } from "../features/sidebar/sidebarsSice";
import { NotificationType } from "../types";
import NotificationPanel from "../components/NotificationPanel";
import { fetchNotifications } from "../api/fetchNotifications";

const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const logout = useLogout();

    const handleLogout = () => {
        logout();
        setModalOpen(false);
    };

    const { isSidebarOpen } = useSelector((state: RootState) => state.sidebar);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.id) return;

        const controller = new AbortController();
        const { signal } = controller;

        const fetchUserNotifications = async () => {
            try {
                const notifications = await fetchNotifications(signal);
                setNotifications(notifications);
            } catch {
                console.log("failed to fetch notifications");
            }
        };

        if (isNotificationOpen) {
            fetchUserNotifications();
        }

        return () => {
            controller.abort();
        };
    }, [user.id, isNotificationOpen]);

    const unreadNotifications = notifications.filter((n) => !n.read).length;

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5"
                style={{
                    height: "10vh",
                    minHeight: "60px",
                    backgroundColor: "var(--bg-color)",
                }}
            >
                <Link to={"/"}>
                    <h1 className="text-lg font-bold text-[var(--heading-color)] sm:text-xl md:text-2xl lg:text-3xl">
                        TypeConquer
                    </h1>
                </Link>
                <div className="flex space-x-2 sm:space-x-4 items-center">
                    <div>
                        <Link to={"/learningcurve"}>Learning Curve</Link>
                    </div>
                    {user && user.id ? (
                        <>
                            {isSidebarOpen && <Sidebar />}
                            <div className="flex gap-8 items-center">
                                <div className="relative cursor-pointer">
                                    <div
                                        className="text-xl"
                                        onClick={() =>
                                            setNotificationOpen(
                                                !isNotificationOpen
                                            )
                                        }
                                    >
                                        <i className="fa-solid fa-bell"></i>
                                        {unreadNotifications > 0 && (
                                            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {unreadNotifications}
                                            </span>
                                        )}
                                    </div>

                                    {isNotificationOpen && (
                                        <NotificationPanel
                                            notifications={notifications}
                                        />
                                    )}
                                </div>
                                <div onClick={() => dispatch(siderbarOpen())}>
                                    <i className="fas fa-users text-xl"></i>
                                </div>
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
                            </div>

                            {isModalOpen && (
                                <div
                                    className="flex flex-col gap-2 absolute top-20 right-4 bg-[var(--highlighted-color)] shadow-lg rounded-lg z-20 bordered-1"
                                    style={{
                                        minWidth: "250px",
                                        maxWidth: "300px",
                                    }}
                                >
                                    <div className="flex gap-4 p-4 border-bottom items-center">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt="Profile"
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                        />
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold truncate">
                                                {user.name}
                                            </p>
                                            <p>@{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 px-2 py-2 truncate border-bottom">
                                        <div className="cursor-pointer">
                                            <Link to={"/typingtest/results"}>
                                                Test Results
                                            </Link>
                                        </div>
                                        <div className="cursor-pointer">
                                            <Link to={"/challenges"}>
                                                Challenges
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-2 border-bottom flex">
                                        <ThemeSelector border={false} />
                                    </div>
                                    <div className="py-2 text-center">
                                        <button onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                to={"/auth/register"}
                                className="bg-[var(--secondary-color)] text-[-var(--text-color)] text-sm sm:text-base px-3 sm:px-4 py-2 rounded hover:bg-opacity-90 transition-all"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </header>
            <div style={{ height: "10vh", minHeight: "60px" }}></div>
        </>
    );
};

export default Header;
