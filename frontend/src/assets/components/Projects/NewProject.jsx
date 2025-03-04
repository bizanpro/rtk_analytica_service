import { useLocation } from "react-router-dom";

const NewProject = () => {
    const location = useLocation();
    const projectName = location.state?.projectName || "Новый проект";

    return (
        <main className="page">
            <div className="container py-8">
                <h1>Создание проекта: {projectName}</h1>
            </div>
        </main>
    );
};
export default NewProject;
