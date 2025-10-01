import { useState, useEffect } from "react";

import "./RateSwitch.scss";

interface RateSwitchProps {
    name: string;
    reportRateData: Record<string, number | undefined>;
}

const RateSwitchStatic = ({ name, reportRateData }: RateSwitchProps) => {
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
        <div className={`rate-switch rate-switch_${currentRateClass}`}>
            <div className="rate-switch__button"></div>
            <div className="rate-switch__button"></div>
            <div className="rate-switch__button"></div>
        </div>
    );
};

export default RateSwitchStatic;
