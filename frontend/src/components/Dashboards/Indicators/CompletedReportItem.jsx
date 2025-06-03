import React from "react";

const CompletedReportItem = ({
    project,
    report_name,
    days,
    assessment,
    execution_period,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[25%_25%_25%_8%] gap-3 cursor-pointer"
            onClick={() => {}}
        >
            <div className="flex flex-col">
                <div className="text-lg">{project.name}</div>
                <span className="text-sm">{}</span>
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{report_name}</div>
                    <span className="text-sm">{execution_period}</span>
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{days}</div>
                    <span className="text-sm">{execution_period}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {assessment && (
                    <>
                        <button
                            type="button"
                            className="info-icon flex-none w-[20px]"
                            title="Посмотреть заключение"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        ></button>

                        <div className="text-lg">{assessment}/10</div>
                    </>
                )}
            </div>
        </li>
    );
};

export default CompletedReportItem;
