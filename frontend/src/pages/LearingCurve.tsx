import { Link } from "react-router-dom";
import useFetchModules from "../api/hooks/useFetchModules";

function LearningCurve() {
    const { loading, error, modules } = useFetchModules();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4 heading">Learning Curve</h1>
            <div className="">
                {modules.map((module) => (
                    <div key={module.id} className="my-4 text-center">
                        <h2 className="p-2 text-xl font-semibold mb-2 bg-[--highlighted-color]">
                            {module.name}
                        </h2>
                        <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4 text-center">
                            {module.lessons.map((lesson) => (
                                <li
                                    key={lesson.id}
                                    className="p-2 bg-[--highlighted-color] hover:bg-[--button-hover] hover:text-[--button-hover-text]"
                                >
                                    <Link
                                        to={`/learningcurve/modules/${module.slug}/lessons/${lesson.slug}`}
                                    >
                                        <span
                                            className={`font-medium ${
                                                lesson.mode === "introduction"
                                                    ? "text-accent-color"
                                                    : ""
                                            }`}
                                        >
                                            {lesson.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LearningCurve;
