import { useNavigate } from "react-router-dom";

export default function LogSigNavbar() {
    const navigate = useNavigate();

    return (
        <nav>
            <div className="w-50%   px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo et menu mobile */}
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center space-x-2"
                            aria-label="Accueil"
                        >
                            <span className="cursor-pointer text-2xl font-bold text-blue-600" onClick={() => navigate("/")}>
                                KmerStay
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}