import { useState, useEffect } from "react";

import getData from "../../utils/getData";

const ProjectLastReport = ({ lastReport }) => {
    const [reportData, setReportData] = useState({});

    useEffect(() => {
        if (lastReport?.id) {
            getData(
                `${import.meta.env.VITE_API_URL}reports/${lastReport.id}`
            ).then((response) => {
                setReportData(response.data);
            });
        }
    }, [lastReport]);

    return (
        <>
            <div className="grid gap-8 mt-5 max-h-[250px] overflow-y-auto">
                {reportData.responsible_persons?.map((person) => (
                    <div
                        key={person.physical_person_id}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{person.full_name}</div>
                            <span className="text-sm">Сотрудник</span>
                        </div>
                        <div className="text-lg">{person.role_name}</div>
                    </div>
                ))}

                {reportData.contragents?.map((person) => (
                    <div
                        key={person.contragent_id}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{person.program_name}</div>
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
