import CountUp from "react-countup";

const FinancialMetrics = ({ financialMetrics }) => {
    return (
        <div className="grid items-stretch grid-cols-3 gap-3 mb-5 h-[90px]">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Выручка
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        financialMetrics.revenue?.value +
                        " " +
                        financialMetrics.revenue?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (
                                    financialMetrics.revenue?.value || "0"
                                ).replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={1}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.revenue?.label}
                    </small>
                </div>
                <div className="text-green-400">
                    {financialMetrics.revenue?.change_percent > 0 &&
                        `+${financialMetrics.revenue?.change_percent}%`}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Поступления
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        financialMetrics.receipts?.value +
                        " " +
                        financialMetrics.receipts?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (
                                    financialMetrics.receipts?.value || "0"
                                ).replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={1}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.receipts?.label}
                    </small>
                </div>
                <div className="text-green-400">
                    {financialMetrics.receipts?.change_percent > 0 &&
                        `+${financialMetrics.receipts?.change_percent}%`}
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    ДЗ
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        financialMetrics.debts?.value +
                        " " +
                        financialMetrics.debts?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (financialMetrics.debts?.value || "0").replace(
                                    ",",
                                    "."
                                )
                            )}
                            duration={1}
                            separator=" "
                            decimals={1}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.debts?.label}
                    </small>
                </div>

                <div className="text-red-400">
                    {financialMetrics.debts?.change_percent > 0 &&
                        `+${financialMetrics.debts?.change_percent}%`}
                </div>
            </div>
        </div>
    );
};

export default FinancialMetrics;
