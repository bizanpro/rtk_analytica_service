import pepcentColorHandler from "../../utils/percentColorHandler";

const SaleServiceItem = ({ service, mode, deleteService }) => {
    return (
        <li
            className="grid items-center grid-cols-[1fr_40%] gap-3 mb-2"
            key={service.id}
        >
            <div className="flex items-center gap-3">{service.full_name}</div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {service.cost}

                    <div
                        className={`${
                            service.cost_change_percent
                                ? pepcentColorHandler(
                                      service.cost_change_percent
                                  )
                                : ""
                        }`}
                    >
                        {service.cost_change_percent}
                    </div>
                </div>

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
