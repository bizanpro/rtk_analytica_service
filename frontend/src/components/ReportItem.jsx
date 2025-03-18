const ReportItem = () => {
    return (
        <li className="grid items-center grid-cols-[24%_24%_49%] gap-3">
            <div className="flex flex-col">
                <div className="text-lg">ФТМ 1Q25</div>
                <span className="text-sm">01.01.25 - 31.03.25</span>
            </div>
            <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                завершён
            </div>
            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">180 дней</div>
                    <span className="text-sm">01.04.25 - 20.05.25</span>
                </div>
                <button
                    type="button"
                    className="flex-none w-[15px] h-[20px] border border-gray-400"
                ></button>
                <button
                    type="button"
                    className="flex-none w-[20px] h-[20px] border border-gray-400 rounded-[50%]"
                ></button>
            </div>
        </li>
    );
};

export default ReportItem;
