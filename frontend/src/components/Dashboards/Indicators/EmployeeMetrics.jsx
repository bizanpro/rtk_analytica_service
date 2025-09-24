import CountUp from "react-countup";

const EmployeeMetrics = ({
    total_active_employees,
    average_salary,
    gross_salary,
}) => {
    return (
        <div className="grid items-stretch grid-cols-4 gap-3 mb-5">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Численность
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        total_active_employees?.value +
                        " " +
                        total_active_employees?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={total_active_employees?.value || 0}
                            duration={1}
                            separator=" "
                            decimals={2}
                        />
                    </strong>
                    <small className="text-sm">
                        {total_active_employees?.label}
                    </small>
                </div>
                <div
                    className={`${
                        total_active_employees?.change_percent > 0
                            ? "text-green-400"
                            : "text-red-400"
                    }`}
                >
                    {total_active_employees?.change_percent &&
                        total_active_employees?.change_percent + "%"}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    ФОТ gross
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={gross_salary?.value + " " + gross_salary?.label}
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (gross_salary?.value || "0").replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">{gross_salary?.label}</small>
                </div>

                <div
                    className={`${
                        gross_salary?.change_percent > 0
                            ? "text-green-400"
                            : "text-red-400"
                    }`}
                >
                    {gross_salary?.change_percent &&
                        gross_salary?.change_percent + "%"}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Средняя з/п
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={average_salary?.value + " " + average_salary?.label}
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (average_salary?.value || "0").replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={1}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">{average_salary?.label}</small>
                </div>

                <div
                    className={`${
                        average_salary?.change_percent > 0
                            ? "text-green-400"
                            : "text-red-400"
                    }`}
                >
                    {average_salary?.change_percent &&
                        average_salary?.change_percent + "%"}
                </div>
            </div>
        </div>
    );
};

export default EmployeeMetrics;
