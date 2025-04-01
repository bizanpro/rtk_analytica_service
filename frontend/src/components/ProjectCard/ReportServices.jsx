import { useState, useEffect } from "react";

import getData from "../../utils/getData";

const ReportServices = ({ projectId }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        getData(
            `${import.meta.env.VITE_API_URL}reports/${projectId}/services`
        ).then((response) => {
            if (response?.status == 200) {
                setServices(response.data);
            }
        });
    }, []);

    return (
        <ul className="grid gap-3 max-h-[175px] overflow-y-auto">
            {services.map((service, index) => (
                <li key={index} className="flex items-center gap-4">
                    <div className="text-lg">{service.name}</div>
                    <div className="text-lg">{service.cost}</div>
                    <div className="text-lg">{service.period}</div>
                    <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                        {service.status}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ReportServices;
