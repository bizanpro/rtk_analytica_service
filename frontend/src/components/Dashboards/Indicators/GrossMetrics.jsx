import CountUp from "react-countup";

const GrossMetrics = ({ financialMetrics }) => {
    return (
        <div className="grid items-stretch grid-cols-3 gap-3 mb-3">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Валовая прибыль
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={`${financialMetrics.gross_profit?.value} ${financialMetrics.gross_profit?.label}`}
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (
                                    financialMetrics.gross_profit?.value || "0"
                                ).replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.gross_profit?.label}
                    </small>
                </div>
                <div className="text-green-400">
                    {financialMetrics.gross_profit?.change_percent > 0 &&
                        `+${financialMetrics.gross_profit?.change_percent}%`}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Валовая рентабельность
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={`${financialMetrics.gross_margin?.value} ${financialMetrics.gross_margin?.label}`}
                    >
                        <CountUp
                            end={financialMetrics.gross_margin?.value || "0"}
                            duration={1}
                            separator=" "
                            decimals={1}
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.gross_margin?.label}
                    </small>
                </div>
                <div className="text-green-400">
                    {financialMetrics.gross_margin?.change_percent > 0 &&
                        `+${financialMetrics.gross_margin?.change_percent} п.п.`}
                </div>
            </div>
        </div>
    );
};

export default GrossMetrics;
