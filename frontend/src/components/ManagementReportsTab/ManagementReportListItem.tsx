import RateSwitchStatic from "../RateSwitch/ReteSwitchStatic";

type Props = {
    openEditor: () => void;
    reportData: object;
};

const ManagementReportListItem = ({ openEditor, reportData }: Props) => {
    let statusClass;

    if (
        reportData.status?.toLowerCase() === "завершен" ||
        reportData.status?.toLowerCase() === "утвержден" ||
        reportData.status?.toLowerCase() === "завершён" ||
        reportData.status?.toLowerCase() === "утверждён"
    ) {
        statusClass = "reports__list-item__status_completed completed";
    } else if (
        reportData.status?.toLowerCase() === "в процессе" ||
        reportData.status?.toLowerCase() === "запланирован" ||
        reportData.status?.toLowerCase() === "в работе"
    ) {
        statusClass = "reports__list-item__status_active active";
    }

    return (
        <li
            className="management-reports__item"
            onClick={() => openEditor(reportData)}
            title={`Открыть отчёт ${reportData.report_month} ${reportData?.physical_person?.name}`}
        >
            <div className="management-reports__item__col">
                <p>{reportData.report_month}</p>
            </div>

            <div className="management-reports__item__col">
                <p>{reportData?.physical_person?.name}</p>
            </div>

            <div className={`reports__list-item__status status ${statusClass}`}>
                {reportData.status}
            </div>

            <div className="management-reports__item__col">
                <RateSwitchStatic
                    name={"general_assessment"}
                    reportRateData={reportData}
                />
            </div>
        </li>
    );
};

export default ManagementReportListItem;
