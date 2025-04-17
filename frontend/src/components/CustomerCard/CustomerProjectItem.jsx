const CustomerProjectItem = ({
    name,
    industry_name,
    budget_in_billions,
    implementation_period,
}) => {
    return (
        <li className="grid items-center grid-cols-[1fr_20%_1fr] gap-3">
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-gray-400">{industry_name}</span>
            </div>
            <div className="flex items-end gap-2">
                <strong className="text-4xl font-normal max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {budget_in_billions}
                </strong>
                <span className="text-1xl leading-6">
                    млрд <br /> руб.
                </span>
            </div>
            <div className="flex flex-col justify-between items-center gap-2">
                <div className="relative h-[20px] w-full border border-gray-200 overflow-hidden text-center flex items-center justify-center">
                    <div className="min-w-min whitespace-nowrap">
                        {implementation_period}%
                    </div>

                    <div
                        className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                        style={{
                            width: `${implementation_period}%`,
                        }}
                    ></div>
                </div>
                <span className="text-xs">{}</span>
            </div>
        </li>
    );
};

export default CustomerProjectItem;
