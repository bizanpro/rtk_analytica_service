const SaleServiceItem = ({
    service,
    setAddWorkScore,
    addWorkScore,
    mode,
    deleteService,
    getStages,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[1fr_40%] gap-3 mb-2 cursor-pointer"
            key={service.id}
            onClick={() => {
                setAddWorkScore(service.id);
                getStages(service.id);
            }}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-[10px] h-[10px] rounded-[50%] transition ${
                        addWorkScore === service.id ? "bg-gray-400" : ""
                    }`}
                ></div>
                {service.full_name}
            </div>
            <div className="flex items-center justify-between">
                -
                {mode === "read" ? (
                    <div className="w-[20px] h-[20px]"></div>
                ) : (
                    <button
                        className="delete-icon flex-none w-[20px] h-[20px]"
                        title="Удалить услугу"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteService(service.id);
                        }}
                    ></button>
                )}
            </div>
        </li>
    );
};

export default SaleServiceItem;
