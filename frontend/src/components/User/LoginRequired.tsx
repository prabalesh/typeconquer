import { Link } from "react-router-dom";
function LoginRequired() {
    return (
        <div>
            <div className="my-2">
                <p>Login is required is access this page</p>
            </div>
            <div className="mt-2 text-center">
                <Link
                    to={"/auth/login"}
                    className="inline-block bg-[--bg-color] bordered rounded-3xl py-2 px-8 hover:bg-[--button-hover] hover:text-[--button-hover-text]"
                >
                    Login
                </Link>
            </div>
        </div>
    );
}

export default LoginRequired;
