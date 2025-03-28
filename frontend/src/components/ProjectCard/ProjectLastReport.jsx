import { useState, useEffect } from "react";

import getData from "../../utils/getData";

const ProjectLastReport = ({ lastReport }) => {
    const [reportData, setReportData] = useState({});

    useEffect(() => {
        if (lastReport.id) {
            getData(
                `${import.meta.env.VITE_API_URL}reports/${lastReport.id}`
            ).then((response) => {
                setReportData(response.data);
            });
        }
    }, [lastReport.id]);

    return (
        <>
            <div className="grid grid-col-3 gap-3">
                <div className="rounded-md bg-gray-200 text-center px-2 py-1 w-[33%]">
                    {reportData.report_name}
                </div>
            </div>

            <div className="grid gap-8 mt-10">
                {reportData.responsible_persons?.map((person, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{person.full_name}</div>
                            <span className="text-sm">Сотрудник</span>
                        </div>
                        <div className="text-lg">{person.role_name}</div>
                    </div>
                ))}

                {reportData.contragents?.map((person, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{person.full_name}</div>
                            <span className="text-sm">Подрядчик</span>
                        </div>
                        <div className="text-lg">{person.role_name}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProjectLastReport;
