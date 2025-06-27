import React from "react";

interface RateSwitchProps {
    name: string;
    rateHandler: (name: string, value: string | number) => void;
}

const RateSwitch: React.FC<RateSwitchProps> = ({ name, rateHandler }) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2">
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-red-400 hover:opacity-100 transition-opacity"
                title="Поставить оценку Плохо"
                onClick={() => rateHandler(name, 0)}
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-yellow-400 hover:opacity-100 transition-opacity"
                title="Поставить оценку Средне"
                onClick={() => rateHandler(name, 1)}
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-green-400 hover:opacity-100 transition-opacity"
                title="Поставить оценку Хорошо"
                onClick={() => rateHandler(name, 2)}
            ></button>
        </nav>
    );
};

export default RateSwitch;
