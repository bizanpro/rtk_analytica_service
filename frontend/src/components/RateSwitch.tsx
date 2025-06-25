import React from "react";

const RateSwitch: React.FC = () => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-red-400 hover:opacity-100 transition-opacity"
                // onClick={(evt) => {
                //     evt.stopPropagation();
                //     if (confirm("Вы уверены?")) {
                //         requestNextStage(stage.next_possible_stages[2].id);
                //     }
                // }}
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-yellow-400 hover:opacity-100 transition-opacity"
                // onClick={(evt) => {
                //     evt.stopPropagation();
                //     requestNextStage(stage.next_possible_stages[1].id);
                // }}
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-green-400 hover:opacity-100 transition-opacity"
                // onClick={(evt) => {
                //     evt.stopPropagation();
                //     requestNextStage(stage.next_possible_stages[0].id);
                // }}
            ></button>
        </nav>
    );
};

export default RateSwitch;
