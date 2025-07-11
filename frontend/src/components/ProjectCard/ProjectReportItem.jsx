const ProjectReportItem = ({
    id,
    report_name,
    status,
    report_period,
    days,
    execution_period,
    // setReportEditorName,
    openReportEditor,
    deleteReport,
    mode,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[33%_20%_33%_1fr] gap-3 cursor-pointer"
            onClick={() => {
                // setReportEditorName(report_name);
                openReportEditor(id);
            }}
        >
            <div className="flex flex-col">
                <div className="text-lg">{report_name}</div>
                <span className="text-sm">{report_period}</span>
            </div>

            <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                {status}
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{days}</div>
                    <span className="text-sm">{execution_period}</span>
                </div>
            </div>

            {/* <div className="flex justify-center">
                {general_assessment && (
                    <div className="text-lg">{general_assessment}/10</div>
                )}
            </div> */}

            <div className="flex items-center justify-end gap-2">
                {/* {general_assessment && (
                    <button
                        type="button"
                        className="info-icon flex-none w-[20px]"
                        title="Посмотреть заключение"
                        onClick={(e) => {
                            e.stopPropagation();
                            openSubReportEditor(id);
                        }}
                    ></button>
                )} */}

                {mode === "edit" && (
                    <button
                        className="delete-icon flex-none w-[20px] h-[20px]"
                        title="Удалить отчёт"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteReport(id);
                        }}
                    ></button>
                )}
            </div>
        </li>
    );
};

export default ProjectReportItem;
