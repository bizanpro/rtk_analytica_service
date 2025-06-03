import { Link } from "react-router-dom";

const CompletedReportItem = ({
    project,
    report_id,
    report_name,
    days,
    assessment,
    industry,
    execution_period,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[25%_25%_25%_8%] gap-3 cursor-pointer"
            onClick={() => {}}
        >
            <Link
                to={`${import.meta.env.VITE_BASE_URL}projects/${project.id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="flex flex-col"
                title="Открыть карточку проекта"
            >
                <div className="text-lg">{project.name}</div>
                <span className="text-sm text-gray-400">{industry}</span>
            </Link>

            <Link
                to={`${import.meta.env.VITE_BASE_URL}projects/${
                    project.id
                }/?report=${report_id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="flex gap-3 items-center"
                title="Открыть отчёт в карточке проекта"
            >
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{report_name}</div>
                    <span className="text-sm">{execution_period}</span>
                </div>
            </Link>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{days}</div>
                    <span className="text-sm">{execution_period}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {assessment && (
                    <>
                        <Link
                            to={`${import.meta.env.VITE_BASE_URL}projects/${
                                project.id
                            }/?report=${report_id}/with_conclusion=true`}
                            onClick={() => window.scrollTo(0, 0)}
                            className="info-icon flex-none w-[20px]"
                            title="Открыть заключение в карточке проекта"
                        ></Link>

                        <div className="text-lg">{assessment}/10</div>
                    </>
                )}
            </div>
        </li>
    );
};

export default CompletedReportItem;
