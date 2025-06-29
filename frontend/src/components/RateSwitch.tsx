import React, { useEffect } from "react";

interface RateSwitchProps {
    name: string;
    rateHandler: (name: string, value: string | number) => void;
    reportRateData: object;
}

const RateSwitch: React.FC<RateSwitchProps> = ({
    name,
    reportRateData,
    rateHandler,
}) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2">
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 hover:opacity-100 transition-opacity ${
                    reportRateData[name] === 0 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Плохо"
                onClick={() => rateHandler(name, 0)}
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 hover:opacity-100 transition-opacity ${
                    reportRateData[name] === 1 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Средне"
                onClick={() => rateHandler(name, 1)}
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 hover:opacity-100 transition-opacity ${
                    reportRateData[name] === 2 ? "opacity-100" : "opacity-30"
                }`}
                title="Поставить оценку Хорошо"
                onClick={() => rateHandler(name, 2)}
            ></button>
        </nav>
    );
};

export default RateSwitch;
