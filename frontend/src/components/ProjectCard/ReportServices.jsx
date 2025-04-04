const ReportServices = ({ services }) => {
    return (
        <ul className="grid gap-3 max-h-[175px] overflow-y-auto">
            {services.map((service, index) => (
                <li
                    key={index}
                    className="grid grid-cols-[10%_1fr_20%_20%] items-center gap-4"
                >
                    <div className="text-lg">{service.name}</div>
                    <div className="text-lg">{service.cost} млн руб.</div>
                    <div className="text-lg">{service.period}</div>
                    <div>
                        <div className="bg-gray-200 py-1 px-3 text-center rounded-md">
                            {service.status}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ReportServices;
