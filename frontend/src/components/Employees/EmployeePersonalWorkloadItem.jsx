const EmployeePersonalWorkloadItem = ({ props, mode, setWorkloads }) => {
    return (
        <li className="grid items-center grid-cols-[1fr_35%_15%] gap-3 mb-2">
            <div className="flex flex-col justify-between gap-2">
                <div className="text-lg">{props?.project_name}</div>

                <span className="text-gray-400">{props?.industry_name}</span>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <div className="text-lg">{props?.report_period_code}</div>
                <span className="text-xs">{props?.execution_period}</span>
            </div>

            <div className="flex items-center border-2 border-gray-300 p-1">
                <input
                    className="min-w-0"
                    type="number"
                    placeholder="0"
                    max="100"
                    min="0"
                    defaultValue={props?.load_percentage}
                    onChange={(evt) => {
                        const value = parseInt(evt.target.value, 10);
                        if (value >= 0 && value <= 100) {
                            setWorkloads((prev) => {
                                const updated = [...prev];
                                const index = updated.findIndex(
                                    (item) => item.report_id === props.report_id
                                );

                                if (index !== -1) {
                                    updated[index] = {
                                        ...updated[index],
                                        load_percentage: value,
                                    };
                                } else {
                                    updated.push({
                                        report_id: props.report_id,
                                        load_percentage: value,
                                    });
                                }

                                return updated;
                            });
                        }
                    }}
                    disabled={mode == "read"}
                />
                %
            </div>
        </li>
    );
};

export default EmployeePersonalWorkloadItem;
