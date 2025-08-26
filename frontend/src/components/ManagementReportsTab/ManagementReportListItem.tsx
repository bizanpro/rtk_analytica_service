type Props = {
    openEditor: () => void;
    reportData: object;
};

const ManagementReportListItem = ({ openEditor, reportData }: Props) => {
    return (
        <li
            className="management-reports__item"
            // onClick={() => openEditor(reportData)}
        >
            <div className="management-reports__item__col">
                <p>{reportData.report_month}</p>
            </div>

            <div className="management-reports__item__col">
                <p>{reportData.physical_person?.name}</p>
            </div>

            <div
                className={`reports__list-item__status status reports__list-item__status_completed completed`}
            >
                {reportData.status}
            </div>

            <div className="management-reports__item__col">
                <nav className={`rate-switch rate-switch_green`}>
                    <button
                        type="button"
                        className="rate-switch__button"
                    ></button>
                    <button
                        type="button"
                        className="rate-switch__button"
                    ></button>
                    <button
                        type="button"
                        className="rate-switch__button"
                    ></button>
                </nav>
            </div>
        </li>
    );
};

export default ManagementReportListItem;
