import "./CardProjects.scss";

const CardProjects = ({
    projects,
    setActiveProject,
    activeProject,
    getProjectReports,
    getProjectContact,
}) => {
    return (
        <ul className="card-projects">
            {projects &&
                projects.length > 0 &&
                projects.map((item) => (
                    <li
                        className={`card-projects__item ${
                            activeProject === item.id ? "active" : ""
                        }`}
                        onClick={() => {
                            getProjectReports(item.id);
                            setActiveProject(item.id);
                            if (typeof getProjectContact === "function") {
                                getProjectContact(item.id);
                            }
                        }}
                    >
                        <div className="card-projects__item-name">
                            <strong>{item.name}</strong>
                            <span>{item.industry}</span>
                        </div>

                        <div className="card-projects__item-budget">
                            {item.project_budget ? (
                                <>
                                    <strong>{item.project_budget}</strong>
                                    <span>млрд руб.</span>
                                </>
                            ) : (
                                "—"
                            )}
                        </div>

                        <div className="card-projects__item-progress">
                            {item.implementation_period ? (
                                <>
                                    <div className="flex items-center gap-[5px]">
                                        <div className="card-projects__item-progress-line-wrapper">
                                            <div
                                                className="card-projects__item-progress-line"
                                                style={{
                                                    width: `${item.implementation_period}%`,
                                                }}
                                            ></div>
                                        </div>

                                        <div className="card-projects__item-progress-percent">
                                            {item.implementation_period}%
                                        </div>
                                    </div>

                                    <span className="card-projects__item-progress-period">
                                        {item.implementation_period_string}
                                    </span>
                                </>
                            ) : (
                                "—"
                            )}
                        </div>

                        <div className={`card-projects__item-status`}>
                            {item.status}
                        </div>
                    </li>
                ))}{" "}
        </ul>
    );
};

export default CardProjects;
