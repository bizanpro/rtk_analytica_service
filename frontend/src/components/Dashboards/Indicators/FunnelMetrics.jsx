import CountUp from "react-countup";

const FunnelMetrics = ({ funnelMetrics }) => {
    return (
        <div className="flex items-center gap-2 mb-3 py-2">
            <div className="grid items-center grid-cols-2 justify-between gap-8 border-r border-gray-300 pr-[20px]">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        {funnelMetrics?.request_received?.label}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong
                            className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={funnelMetrics?.request_received?.value}
                        >
                            <CountUp
                                end={
                                    funnelMetrics?.request_received?.value || 0
                                }
                                duration={1}
                                separator=" "
                            />
                        </strong>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        {funnelMetrics?.proposal_sent?.label}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong
                            className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={funnelMetrics?.proposal_sent?.value}
                        >
                            <CountUp
                                end={funnelMetrics?.proposal_sent?.value || 0}
                                duration={1}
                                separator=" "
                            />
                        </strong>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 flex-grow pl-[20px]">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        {funnelMetrics?.agreement?.label}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong
                            className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={funnelMetrics?.agreement?.value}
                        >
                            <CountUp
                                end={funnelMetrics?.agreement?.value || 0}
                                duration={1}
                                separator=" "
                            />
                        </strong>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        {funnelMetrics?.rejected?.label}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong
                            className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={funnelMetrics?.rejected?.value}
                        >
                            <CountUp
                                end={funnelMetrics?.rejected?.value || 0}
                                duration={1}
                                separator=" "
                            />
                        </strong>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        {funnelMetrics?.postponed?.label}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong
                            className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={funnelMetrics?.postponed?.value}
                        >
                            <CountUp
                                end={funnelMetrics?.postponed?.value || 0}
                                duration={1}
                                separator=" "
                            />
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelMetrics;
