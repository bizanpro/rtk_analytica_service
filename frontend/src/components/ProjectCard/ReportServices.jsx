const ReportServices = ({ services }) => {
    return (
        <ul className="grid gap-3 max-h-[175px] overflow-y-auto">
            {services.map((service, index) => (
                <li
                    key={index}
                    className="grid grid-cols-[10%_25%_25%_28%] items-center gap-5"
                >
                    <div className="text-lg">{service.name}</div>
                    <div className="text-lg">
                        {service.cost != "-" ? (
                            <>{service.cost} млн руб.</>
                        ) : (
                            "-"
                        )}
                    </div>
                    <div className="text-lg">{service.regularity}</div>
                    <div>
                        <div className="bg-gray-200 py-1 px-3 text-center rounded-md">
                            {service.status}
                        </div>

                        <div className="project-card__services-list__item-cost">
                            <div>{service.cost}</div>
                            <div>млн руб.</div>
                        </div>
                    </li>
                ))
            ) : (
                <li>Нет данных</li>
            )}
        </ul>
    );
};

export default ReportServices;
