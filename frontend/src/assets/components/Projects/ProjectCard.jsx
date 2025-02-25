import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postData from "../../utils/postData";

const ProjectCard = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState({});

    useEffect(() => {
        postData("POST", "../../../src/data/projects.json", {}).then(
            (response) => {
                const data = response.find((item) => item.id == projectId);
                console.log(data);

                setProjectData(data);
            }
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <a href="/projects">Назад</a>

                <h1 className="text-4xl mb-8">Карточка проекта</h1>

                {projectData && Object.keys(projectData).length > 0 ? (
                    <div className="project-card__wrapper">
                        <div className="project-card__header flex gap-10">
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">
                                    ID проекта
                                </span>
                                <p>{projectData.id}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Time code</span>
                                <p>{projectData.time_code}</p>
                            </div>
                        </div>

                        <div className="project-card__body grid grid-cols-3 gap-2"></div>
                    </div>
                ) : (
                    <p>Нет данных</p>
                )}
            </div>
        </main>
    );
};

export default ProjectCard;
