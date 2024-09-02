import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./layout/Layout";

import { useFetchUserData } from "./api/hooks/useFetchUserData";

import Home from "./pages/Home";
import Register from "./pages/Register";
import TypingTestResults from "./pages/TypingTestResults";
import Challenge from "./pages/Challenge";
import ChallengesPage from "./pages/ChallengesPage";
import NotFound from "./pages/NotFound";

function App() {
    // to fetch user data
    useFetchUserData();

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
                    <Route
                        path="/typingtest/results"
                        element={<TypingTestResults />}
                    />
                    <Route
                        path="/challenge/:challengeID"
                        element={<Challenge />}
                    />
                    <Route path="/challenges" element={<ChallengesPage />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </div>
    );
}

export default App;
