import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

export default Layout;
