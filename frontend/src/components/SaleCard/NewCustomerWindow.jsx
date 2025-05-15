import { useState } from "react";

const NewCustomerWindow = ({
    setAddCustomer,
    contragents,
    handleInputChange,
    projectData,
    updateProject,
}) => {
    const [customerType, setCustomerType] = useState("new");

    console.log(projectData);

    return (
        <div className="flex flex-col gap-3">
            <div className="text-base font-bold">Добавление заказчика</div>

            <nav className="switch">
                <div>
                    <input
                        type="radio"
                        name="customerType"
                        id="new_customer"
                        onChange={() => {
                            setCustomerType("new");
                        }}
                        checked={customerType === "new"}
                    />
                    <label htmlFor="new_customer">Новый</label>
                </div>

                <div>
                    <input
                        type="radio"
                        name="customerType"
                        id="exist_customer"
                        onChange={() => setCustomerType("exist")}
                        checked={customerType === "exist"}
                    />
                    <label htmlFor="exist_customer">Существующий</label>
                </div>
            </nav>

            <div className="border-2 border-gray-300 p-2">
                {customerType === "new" ? (
                    <input
                        className="w-full h-[21px]"
                        placeholder="Введите имя заказчика"
                        type="text"
                    />
                ) : (
                    <select
                        className="w-full h-[21px]"
                        value={projectData?.contragent_id || ""}
                        onChange={(e) => handleInputChange(e, "contragent_id")}
                    >
                        <option value="">Выберите заказчика</option>
                        {contragents.length > 0 &&
                            contragents.map((item) => (
                                <option value={item.id} key={item.id}>
                                    {item.program_name}
                                </option>
                            ))}
                    </select>
                )}
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                <span className="flex items-center gap-2 text-gray-400">
                    Тип{" "}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </span>
                <div className="border-2 border-gray-300 p-2">
                    <select className="w-full h-[21px]">
                        <option value="">Выберите Тип</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-2 flex-grow grid-cols-2 mt-2">
                <button
                    type="button"
                    className="border rounded-lg py-3 px-5 bg-black text-white"
                    onClick={() => {
                        updateProject();
                        setAddCustomer(false);
                    }}
                    title="Сохранить заказчика"
                >
                    Сохранить
                </button>
                <button
                    type="button"
                    className="border rounded-lg py-3 px-5"
                    onClick={() => setAddCustomer(false)}
                    title="Отменить добавление заказчика"
                >
                    Отменить
                </button>
            </div>
        </div>
    );
};

export default NewCustomerWindow;
