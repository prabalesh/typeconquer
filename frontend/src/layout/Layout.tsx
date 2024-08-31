import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { siderbarClose } from "../features/sidebar/sidebarsSice";

function Layout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    return (
        <>
            <Header />
            <main
                className="flex flex-col items-center justify-center"
                style={{ minHeight: "80vh" }}
                onClick={() => dispatch(siderbarClose())}
            >
                {children}
            </main>
            <Footer />
        </>
    );
}

export default Layout;
