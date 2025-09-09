interface RateSwitchProps {
    name: string;
    rateHandler: (name: string, value: string | number) => void;
    reportRateData: Record<string, number | undefined>;
    mode: string;
}

const RateSwitch = ({
    name,
    reportRateData,
    rateHandler,
    mode,
}: RateSwitchProps) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2">
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 ${
                    mode === "edit" ? "hover:opacity-100" : "cursor-none"
                } transition-opacity ${
                    reportRateData[name] === 0 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Плохо"
                onClick={(evt) => {
                    if (mode == "read") return;
                    evt.stopPropagation();
                    rateHandler(name, 0);
                }}
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 ${
                    mode === "edit" ? "hover:opacity-100" : "cursor-none"
                }  transition-opacity ${
                    reportRateData[name] === 1 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Средне"
                onClick={(evt) => {
                    if (mode == "read") return;
                    evt.stopPropagation();
                    rateHandler(name, 1);
                }}
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 ${
                    mode === "edit" ? "hover:opacity-100" : "cursor-none"
                }  transition-opacity ${
                    reportRateData[name] === 2 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Хорошо"
                onClick={(evt) => {
                    if (mode == "read") return;
                    evt.stopPropagation();
                    rateHandler(name, 2);
                }}
            ></button>
        </nav>
    );
};

export default RateSwitch;
