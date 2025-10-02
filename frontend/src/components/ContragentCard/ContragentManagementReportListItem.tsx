type Props = {
    openEditor: () => void;
    reportData: object;
};

const ContragentManagementReportListItem = ({
    openEditor,
    reportData,
}: Props) => {
    return (
        <li
            className="grid items-center grid-cols-[18%_15%_46px_15%_1fr] gap-[20px] cursor-pointer"
            onClick={() => openEditor(reportData)}
        >
            <div className="text-lg">{reportData.project_name}</div>

            <div className="text-lg">{reportData.report_month}</div>

            <div className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-1">
                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 ${
                        reportData.general_assessment === 0
                            ? "opacity-100"
                            : "opacity-30"
                    }`}
                ></div>

                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 ${
                        reportData.general_assessment === 1
                            ? "opacity-100"
                            : "opacity-30"
                    }`}
                ></div>

                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 ${
                        reportData.general_assessment === 2
                            ? "opacity-100"
                            : "opacity-30"
                    }`}
                ></div>
            </div>

            <div>{reportData.status}</div>

            <div className="text-lg" title={reportData.physical_person?.name}>
                <div
                    className="overflow-hidden text-ellipsis"
                    style={{
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        display: "-webkit-box",
                    }}
                >
                    {reportData.physical_person?.name}
                </div>

                {reportData?.physical_person?.roles?.map((item) => (
                    <div className="text-sm" key={item.id}>
                        {item.name}
                    </div>
                ))}
            </div>
        </li>
    );
};

export default ContragentManagementReportListItem;
