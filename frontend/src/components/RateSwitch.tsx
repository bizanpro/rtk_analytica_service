import React from "react";

const RateSwitch: React.FC = () => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2">
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-red-400 hover:opacity-100 transition-opacity"
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-yellow-400 hover:opacity-100 transition-opacity"
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-green-400 hover:opacity-100 transition-opacity"
            ></button>
        </nav>
    );
};

export default RateSwitch;
