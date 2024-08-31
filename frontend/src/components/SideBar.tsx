import Challengebar from "./Challenge/Challengebar";
import Friendbar from "./Friends/Friendbar";

interface SidebarProps {
    closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
    return (
        <div className="fixed right-0 top-0 w-64 h-screen bg-[--highlighted-color] text-[--highlighted-text] flex flex-col shadow-lg z-50 transition-transform duration-300 md:w-72 lg:w-80">
            <div
                onClick={closeSidebar}
                className="absolute top-4 right-4 cursor-pointer p-2 bg-[--highlighted-color] text-[--highlighted-text] rounded-full hover:bg-[--button-hover] hover:text-[--button-hover-text] flex items-center justify-center"
                aria-label="Close sidebar"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </div>
            <Friendbar />
            <Challengebar closeSidebar={closeSidebar} />
        </div>
    );
};

export default Sidebar;
