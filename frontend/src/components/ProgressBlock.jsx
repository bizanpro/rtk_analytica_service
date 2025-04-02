const ProgressBlock = ({ percentage, date }) => {
    const progress = percentage > 100 ? 0 : percentage;

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-full border border-gray-300 overflow-hidden p-2 text-center">
                <div className="min-w-min whitespace-nowrap">{date}</div>

                <div
                    className="absolute top-0 left-0 bottom-0 h-full bg-gray-300 transition-all opacity-60 z-[-1]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="relative flex items-center gap-1 h-full text-gray-400">
                <div className="max-w-[40px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {percentage > 100 ? "0" : `${percentage}`}
                </div>
                %
            </div>
        </div>
    );
};

export default ProgressBlock;
