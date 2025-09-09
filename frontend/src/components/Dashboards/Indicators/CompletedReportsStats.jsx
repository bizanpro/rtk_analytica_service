import CompletedReportItem from "./CompletedReportItem";

const CompletedReportsStats = ({ completedReports }) => {
    return (
        <section className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 border border-gray-300 p-4">
                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                    Отчёты руководителей проектов (20)
                </h2>
            </div>

            <div className="flex flex-col gap-3 border border-gray-300 p-4">
                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                    Завершённые отчёты ({completedReports.items?.length || 0})
                </h2>

                <ul className="max-h-[280px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-3">
                    {completedReports.items?.length > 0 &&
                        completedReports.items.map((report) => (
                            <CompletedReportItem key={report.id} {...report} />
                        ))}
                </ul>
            </div>
        </section>
    );
};

export default CompletedReportsStats;
