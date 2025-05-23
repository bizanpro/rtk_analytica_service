import SaleFunnelActions from "./SaleFunnelActions";

const SaleFunnelItemCurrent = ({ stage, requestNextStage }) => {
    return (
        <li className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg">
            <div className="flex flex-col">{stage[0].name}</div>

            <div className="border-2 border-gray-300 p-1 w-full h-[32px]"></div>

            <SaleFunnelActions
                stage={stage}
                requestNextStage={requestNextStage}
            />
        </li>
    );
};

export default SaleFunnelItemCurrent;
