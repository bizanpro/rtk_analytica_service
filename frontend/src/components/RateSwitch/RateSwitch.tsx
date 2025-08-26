import { useState, useEffect } from "react";

import "./RateSwitch.scss";

interface RateSwitchProps {
    name: string;
    rateHandler: (name: string, value: string | number) => void;
    reportRateData: Record<string, number | undefined>;
}

const RateSwitch = ({ name, reportRateData, rateHandler }: RateSwitchProps) => {
    const [currentRateClass, setCurrentRateClass] = useState("");

    const handleRateClass = () => {
        switch (reportRateData[name]) {
            case 0:
                setCurrentRateClass("red");
                break;

            case 1:
                setCurrentRateClass("orange");
                break;

            case 2:
                setCurrentRateClass("green");
                break;

            default:
                setCurrentRateClass("");
                break;
        }
    };

    useEffect(() => {
        handleRateClass();
    }, [reportRateData[name]]);

    return (
        <nav className={`rate-switch rate-switch_${currentRateClass}`}>
            <button
                type="button"
                className="rate-switch__button"
                title="Поставить оценку Плохо"
                onClick={(evt) => {
                    evt.stopPropagation();
                    rateHandler(name, 0);
                }}
            ></button>
            <button
                type="button"
                className="rate-switch__button"
                title="Поставить оценку Средне"
                onClick={(evt) => {
                    evt.stopPropagation();
                    rateHandler(name, 1);
                }}
            ></button>
            <button
                type="button"
                className="rate-switch__button"
                title="Поставить оценку Хорошо"
                onClick={(evt) => {
                    evt.stopPropagation();
                    rateHandler(name, 2);
                }}
            ></button>
        </nav>
    );
};

export default RateSwitch;
