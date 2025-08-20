const ReportServices = ({ services }) => {
    return (
        <ul className="project-card__services-list">
            {services.length > 0 ? (
                services.map((service, index) => (
                    <li
                        key={index}
                        className="project-card__services-list__item"
                    >
                        <div className="project-card__services-list__item-name">
                            {service.name}
                        </div>

                        <div className="project-card__services-list__item-status">
                            <div>{service.status}</div>
                        </div>

                        <div className="project-card__services-list__item-period">
                            {service.regularity}
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
