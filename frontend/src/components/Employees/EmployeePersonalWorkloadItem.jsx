import { useState } from "react";
import postData from "../../utils/postData";

const EmployeePersonalWorkloadItem = ({ props, employeeId, mode }) => {
    const [personalWorkloadData, setPersonalWorkloadData] = useState(props);

    const updateLoadPercentage = () => {
        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/${employeeId}/personal-workload/${
                personalWorkloadData.report_id
            }`,
            { load_percentage: personalWorkloadData.load_percentage }
        ).then((response) => {
            if (response?.ok) {
                alert("Успешно обновлено!");
            } else {
                alert("Ошибка обновления данных");
            }
        });
    };

    return (
        <li className="grid items-center grid-cols-[1fr_35%_20px_15%] gap-3 mb-2">
            <div className="flex flex-col justify-between gap-2">
                <div className="text-lg">
                    {personalWorkloadData.project_name}
                </div>

                <span className="text-gray-400">
                    {personalWorkloadData.industry_name}
                </span>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <div className="text-lg">
                    {personalWorkloadData.report_name}
                </div>
                <span className="text-xs">
                    {personalWorkloadData.execution_period}
                </span>
            </div>

            {mode == "edit" ? (
                <button
                    type="button"
                    className="save-icon w-[20px] h-[20px]"
                    onClick={() => updateLoadPercentage()}
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
                    value={personalWorkloadData.load_percentage}
                    onChange={(evt) => {
                        setPersonalWorkloadData((prev) => ({
                            ...prev,
                            load_percentage: evt.target.value,
                        }));
                    }}
                    disabled={mode == "read" ? true : false}
                />
                %
            </div>
        </li>
    );
};

export default EmployeePersonalWorkloadItem;
