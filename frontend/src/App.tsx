import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layour";
import Home from "./pages/Home";

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Layout>
        </div>
    );
}

export default App;
