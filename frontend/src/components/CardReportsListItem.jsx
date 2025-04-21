const CardReportsListItem = ({
    id,
    name,
    industry,
    report_name,
    report_period,
    status,
    execution_period,
    days,
    setReportEditorName,
    openReportEditor,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[1fr_1fr_18%_1fr] gap-4 cursor-pointer"
            onClick={() => {
                setReportEditorName(name);
                openReportEditor(id);
            }}
        >
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-sm text-gray-400">{industry}</span>
            </div>

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
        </li>
    );
};

export default CardReportsListItem;
