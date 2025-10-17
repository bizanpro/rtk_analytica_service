const EmployeeWorkloadSummary = ({
    workloadSummaryMaxPercentage,
    workloadSummary,
}) => {
    return (
        <ul className="employee-card__workload-summary__list">
            {workloadSummary &&
                workloadSummary.length > 0 &&
                workloadSummary.map((item) => (
                    <li
                        className="employee-card__workload-summary__list-item"
                        key={item.uuid}
                    >
                        <div className="employee-card__workload-summary__list-item-main">
                            <div className="employee-card__workload-summary__list-item-name">
                                {item.project_name}
                                {item.industry_names &&
                                    item.industry_names.map(
                                        (item) => `, ${item.toLowerCase()}`
                                    )}
                            </div>

                            <div className="employee-card__workload-summary__list-item-hours">
                                <span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.584 6.758V4.083H6.417v2.675c0 .31.123.607.342.825l1.87 1.871.825-.825-1.87-1.87z"
                                            fill="#98A2B3"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M7 12.833A5.833 5.833 0 117 1.167a5.833 5.833 0 010 11.666zm0-1.166a4.667 4.667 0 100-9.334 4.667 4.667 0 000 9.334z"
                                            fill="#98A2B3"
                                        />
                                    </svg>
                                </span>

                                {item.total_hours}
                            </div>

                            <div className="employee-card__workload-summary__list-item-percentage">
                                {item.load_percentage}%
                            </div>
                        </div>

                        <div className="card-projects__item-progress-line-wrapper">
                            <div
                                className="card-projects__item-progress-line"
                                style={{
                                    width: `${
                                        (item.load_percentage /
                                            workloadSummaryMaxPercentage) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default EmployeeWorkloadSummary;
