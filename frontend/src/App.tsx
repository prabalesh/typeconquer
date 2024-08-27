import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./features/user/userSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/user`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    dispatch(setUser(data));
                } else if (response.status === 401) {
                    // Token might be expired, attempt to refresh
                    const refreshResponse = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                        {
                            method: "POST",
                            credentials: "include",
                        }
                    );

                    if (refreshResponse.ok) {
                        // const refreshData = await refreshResponse.json();
                        // Retry fetching user data with new token
                        const retryResponse = await fetch(
                            `${import.meta.env.VITE_API_URL}/api/auth/user`,
                            {
                                method: "GET",
                                credentials: "include",
                            }
                        );

                        if (retryResponse.ok) {
                            const data = await retryResponse.json();
                            dispatch(setUser(data));
                        } else {
                            dispatch(clearUser());
                        }
                    } else {
                        dispatch(clearUser());
                    }
                } else {
                    dispatch(clearUser());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                dispatch(clearUser());
            }
        };

        fetchUserData();
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
            <Layout>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="dark"
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/login" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </div>
    );
}

export default App;
