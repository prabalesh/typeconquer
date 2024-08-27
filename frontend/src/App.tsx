import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { clearUser, setUser } from "./features/user/userSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/user`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (res.ok) {
                const data = await res.json();
                dispatch(setUser(data));
            } else {
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
