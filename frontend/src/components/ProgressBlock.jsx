const ProgressBlock = ({ percentage, date }) => {
    const progress = percentage > 100 ? 0 : percentage;

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-full border border-gray-300 overflow-hidden p-2">
                {date}

                <div
                    className="absolute top-0 left-0 bottom-0 h-full bg-gray-300 transition-all opacity-60 z-[-1]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="relative z-10 flex justify-center items-center h-full text-gray-400">
                {percentage > 100 ? "0%" : `${percentage}%`}
            </div>
        </div>
    );
};

export default ProgressBlock;
