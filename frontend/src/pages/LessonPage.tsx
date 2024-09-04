import { Link, useParams } from "react-router-dom";
import useFetchLesson from "../api/hooks/useFetchLesson";
import Spinner from "../components/Spinner";
import IntroductionLesson from "../components/Learning/IntroductionLesson";
import PracticeLesson from "../components/Learning/PracticeLesson";
import useFetchModule from "../api/hooks/useFetchModule";

function LessonPage() {
    const { lessonSlug, moduleSlug } = useParams();

    const { loading, error, lesson } = useFetchLesson(lessonSlug);
    const { moduleLoading, module } = useFetchModule(moduleSlug);

    if (loading || moduleLoading) {
        return (
            <>
                <Spinner />
            </>
        );
    }

    if (error || !lesson || !module) {
        return (
            <>
                <p>Error: {error}</p>
            </>
        );
    }

    const lessonIndex = module.lessons.findIndex((l) => l.slug === lessonSlug);
    const previousLessonSlug =
        lessonIndex > 0 ? module.lessons[lessonIndex - 1].slug : null;
    const nextLessonSlug =
        lessonIndex < module.lessons.length - 1
            ? module.lessons[lessonIndex + 1].slug
            : null;

    const btnComponent = (
        <div className="flex gap-4 justify-center w-[60vw] my-4">
            {previousLessonSlug && (
                <Link
                    to={`/learningcurve/modules/${moduleSlug}/lessons/${previousLessonSlug}`}
                    className="bg-gray-300 text-slate-900 hover:bg-gray-400 hover:text-slate-100 px-4 py-1 rounded-3xl "
                >
                    Previous
                </Link>
            )}
            {nextLessonSlug && (
                <Link
                    to={`/learningcurve/modules/${moduleSlug}/lessons/${nextLessonSlug}`}
                    className="bg-green-200 text-slate-900 hover:bg-green-400 hover:text-slate-100 px-4 py-1 rounded-3xl "
                >
                    Next
                </Link>
            )}
        </div>
    );

    if (lesson.mode === "introduction") {
        return (
            <>
                <IntroductionLesson lesson={lesson} />
                {btnComponent}
            </>
        );
    }
    if (lesson.mode === "practice") {
        return (
            <>
                <PracticeLesson lesson={lesson} />
                {btnComponent}
            </>
        );
    }

    return (
        <div>
            LessonPage
            {lesson && (
                <div>
                    <h1>{lesson?.name}</h1>
                    <p>{lesson?.mode}</p>
                    <p>{lesson?.words}</p>
                </div>
            )}
        </div>
    );
}

export default LessonPage;
