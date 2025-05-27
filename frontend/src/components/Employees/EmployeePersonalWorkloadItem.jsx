import { useState, useEffect } from "react";

const EmployeePersonalWorkloadItem = ({
    props,
    mode,
    updateLoadPercentage,
}) => {
    const [personalWorkloadData, setPersonalWorkloadData] = useState(props);

    useEffect(() => {
        if (props) {
            setPersonalWorkloadData(props);
        }
    }, [props]);

    return (
        <li className="grid items-center grid-cols-[1fr_35%_20px_15%] gap-3 mb-2">
            <div className="flex flex-col justify-between gap-2">
                <div className="text-lg">
                    {personalWorkloadData?.project_name}
                </div>

                <span className="text-gray-400">
                    {personalWorkloadData?.industry_name}
                </span>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <div className="text-lg">
                    {personalWorkloadData?.report_name}
                </div>
                <span className="text-xs">
                    {personalWorkloadData?.execution_period}
                </span>
            </div>

            {mode == "edit" ? (
                <button
                    type="button"
                    className="save-icon w-[20px] h-[20px]"
                    onClick={() => updateLoadPercentage(personalWorkloadData)}
                    title="Обновить запись"
                ></button>
            ) : (
                <div></div>
            )}

            <div className="flex items-center border-2 border-gray-300 p-1">
                <input
                    className="min-w-0"
                    type="number"
                    placeholder="0"
                    max="100"
                    min="0"
                    value={personalWorkloadData?.load_percentage}
                    onChange={(evt) => {
                        const value = parseInt(evt.target.value, 10);
                        if (value >= 0) {
                            setPersonalWorkloadData((prev) => ({
                                ...prev,
                                load_percentage: value,
                            }));
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
