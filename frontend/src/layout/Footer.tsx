import React from "react";
import ThemeSelector from "./ThemeSelector";
import FontSelector from "./FontSelector";

const Footer: React.FC = () => {
    return (
        <footer
            className="bg-footer-background text-footer-text py-4 sm:py-6 md:py-8"
            style={{ height: "10vh", minHeight: "60px" }}
        >
            <div className="container mx-auto px-2 flex justify-end gap-4">
                <ThemeSelector border={true} />
                <FontSelector />
            </div>
        </footer>
    );
};

export default Footer;
