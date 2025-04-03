const ProjectReportItem = ({
    id,
    report_name,
    status,
    report_period,
    days,
    general_assessment,
    execution_period,
    setReportEditorName,
    openReportEditor,
    deleteReport,
    mode,
}) => {
    return (
        <li
            className={`grid items-center grid-cols-[25%_18%_25%_15%_6%] gap-3 ${
                mode === "read" ? "cursor-pointer" : ""
            }`}
            onClick={
                mode === "read"
                    ? () => {
                          setReportEditorName(report_name);
                          openReportEditor(id);
                      }
                    : undefined
            }
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

            <div className="flex justify-center">
                {general_assessment && (
                    <div className="text-lg">{general_assessment}/10</div>
                )}
            </div>

            {mode === "edit" && (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="edit-icon flex-none w-[15px] h-[20px]"
                        title="Редактировать отчёт"
                        onClick={() => {
                            setReportEditorName(report_name);
                            openReportEditor(id);
                        }}
                    ></button>

                    <button
                        className="delete-icon flex-none w-[20px] h-[20px]"
                        title="Удалить отчёт"
                        onClick={() => deleteReport(id)}
                    ></button>
                </div>
            )}
        </li>
    );
};

export default ProjectReportItem;
