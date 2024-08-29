import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main
                className="flex flex-col items-center justify-center"
                style={{ minHeight: "80vh" }}
            >
                {children}
            </main>
            <Footer />
        </>
    );
}

export default Layout;
