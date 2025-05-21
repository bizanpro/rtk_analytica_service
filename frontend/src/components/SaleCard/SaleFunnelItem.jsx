import { useState } from "react";

import SaleFunnelActions from "./SaleFunnelActions";

import DatePicker from "react-datepicker";

const SaleFunnelItem = ({ mode }) => {
    return (
        <li className="grid items-center grid-cols-[1fr_28%_26%] gap-3 mb-2 text-lg">
            <div className="flex items-center gap-2">Получен запрос</div>
            <div className="flex items-center gap-2">
                <DatePicker
                    className="border-2 border-gray-300 p-1 w-full h-[32px]"
                    // selected={new Date()}
                    placeholderText="дд.мм.гггг"
                    startDate={new Date()}
                    dateFormat="dd.MM.yyyy"
                    disabled={mode === "read" ? true : false}
                />
            </div>
            <SaleFunnelActions />
        </li>
    );
};

export default SaleFunnelItem;
