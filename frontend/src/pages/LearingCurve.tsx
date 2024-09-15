import { Link } from "react-router-dom";
import useFetchModules from "../api/hooks/useFetchModules";

function LearningCurve() {
    const { loading, error, modules } = useFetchModules();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 heading">
                Learning Curve
            </h1>
            <div>
                {modules.map((module) => (
                    <div key={module.id} className="my-4 text-center">
                        <h2 className="p-2 text-xl md:text-2xl lg:text-3xl font-semibold mb-2 bg-[--highlighted-color]">
                            {module.name}
                        </h2>
                        <ul className="grid gap-4 text-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {module.lessons.map((lesson) => (
                                <li
                                    key={lesson.id}
                                    className="p-2 bg-[--highlighted-color] hover:bg-[--button-hover] hover:text-[--button-hover-text] rounded-md"
                                >
                                    <Link
                                        to={`/learning/modules/${module.slug}/lessons/${lesson.slug}`}
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
