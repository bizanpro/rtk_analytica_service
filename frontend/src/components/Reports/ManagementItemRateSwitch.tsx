interface RateSwitchProps {
    name: string;
    rateHandler: (name: string, value: string | number) => void;
    reportRateData: Record<string, number | undefined>;
}

const ManagementItemRateSwitch = ({ name, reportRateData, rateHandler }: RateSwitchProps) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2">
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 hover:opacity-100 transition-opacity ${
                    reportRateData[name] === 0 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Плохо"
                onClick={(evt) => {
                    evt.stopPropagation();
                    rateHandler(reportRateData, 0);
                }}
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 hover:opacity-100 transition-opacity ${
                    reportRateData[name] === 1 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Средне"
                onClick={(evt) => {
                    evt.stopPropagation();
                    rateHandler(reportRateData, 1);
                }}
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 hover:opacity-100 transition-opacity ${
                    reportRateData[name] === 2 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Хорошо"
                onClick={(evt) => {
                    evt.stopPropagation();
                    rateHandler(reportRateData, 2);
                }}
            ></button>
        </nav>
    );
};

export default ManagementItemRateSwitch;
