import React from "react";

// eslint-disable-next-line react/display-name
const ReportServices = React.memo(({ reports }) => {
    const filteredReports = reports.filter(
        (report) => report.status === "В работе" || report.status === "Завершен"
    );

    const lastFTA = [...filteredReports]
        .reverse()
        .find((report) => report.report_name.includes("ФТА"));
    const lastFM = [...filteredReports]
        .reverse()
        .find((report) => report.report_name.includes("ФМ"));

    const uniqueReports = filteredReports.filter(
        (report) =>
            !report.report_name.includes("ФТА") &&
            !report.report_name.includes("ФМ")
    );

    if (lastFTA) uniqueReports.push(lastFTA);
    if (lastFM) uniqueReports.push(lastFM);

    return (
        <ul className="grid gap-3 max-h-[175px] overflow-y-auto">
            {uniqueReports.map((report) => (
                <li key={report.id} className="flex items-center gap-4">
                    <div className="text-lg">{report.report_name}</div>
                    <div className="text-lg">
                        {report.amount || "5,0 млн руб."}
                    </div>
                    <div className="text-lg">
                        {report.frequency || "ежеквартально"}
                    </div>
                    <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                        {report.status}
                    </div>
                </li>
            ))}
        </ul>
    );
});

export default ReportServices;
