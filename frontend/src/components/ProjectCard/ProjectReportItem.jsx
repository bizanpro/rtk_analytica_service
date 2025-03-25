const ProjectReportItem = ({
    id,
    name,
    status,
    create_date_start,
    create_date_end,
    period,
    completion_period_start,
    completion_period_end,
    setReportEditorState,
    setReportEditorName,
}) => {
    return (
        <li className="grid items-center grid-cols-[24%_24%_49%] gap-3">
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-sm">
                    {create_date_start} - {create_date_end}
                </span>
            </div>
            <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                {status}
            </div>
            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{period}</div>
                    <span className="text-sm">
                        {completion_period_start} - {completion_period_end}
                    </span>
                </div>
                <button
                    type="button"
                    className="flex-none w-[15px] h-[20px] border border-gray-400"
                    onClick={() => {
                        setReportEditorName(name);
                        setReportEditorState(true);
                    }}
                ></button>
                <button
                    type="button"
                    className="flex-none w-[20px] h-[20px] border border-gray-400 rounded-[50%]"
                ></button>
            </div>
        </li>
    );
};

export default ProjectReportItem;
