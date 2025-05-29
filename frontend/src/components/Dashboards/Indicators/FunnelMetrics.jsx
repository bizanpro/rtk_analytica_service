const FunnelMetrics = () => {
    return (
        <div className="flex items-center gap-2 mb-3 p-4 border-b border-gray-300">
            <div className="grid items-stretch grid-cols-2 gap-3 border-r border-gray-300">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        Запрос
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span>0</span>
                        </strong>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        КП
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span>0</span>
                        </strong>
                    </div>
                </div>
            </div>

            <div className="grid items-stretch grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        Согласие
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span>0</span>
                        </strong>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        Отказ
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span>0</span>
                        </strong>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-medium">
                        Отложен
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span>0</span>
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelMetrics;
