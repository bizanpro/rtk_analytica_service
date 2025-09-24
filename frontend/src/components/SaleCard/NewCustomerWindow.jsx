import { useState } from "react";

import CreatableSelect from "react-select/creatable";

const NewCustomerWindow = ({
    setAddCustomer,
    contragents,
    handleInputChange,
    projectData,
    updateProject,
    sendNewContragent,
}) => {
    const [customerType, setCustomerType] = useState("new");
    const [programName, setProgramName] = useState("");

    {
        /* <select
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
                    </select> */
    }

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
                    <label htmlFor="new_customer">Ввести вручную</label>
                </div>

                <div>
                    <input
                        type="radio"
                        name="customerType"
                        id="exist_customer"
                        onChange={() => setCustomerType("exist")}
                        checked={customerType === "exist"}
                    />
                    <label htmlFor="exist_customer">
                        Выбрать из существующих
                    </label>
                </div>
            </nav>

            <div className="border-2 border-gray-300 p-2">
                {customerType === "new" ? (
                    <input
                        className="w-full h-[21px]"
                        placeholder="Введите имя заказчика"
                        value={programName}
                        type="text"
                        onChange={(e) => setProgramName(e.target.value)}
                    />
                ) : (
                    <CreatableSelect
                        isClearable
                        options={
                            contragents.length > 0 &&
                            contragents.map((item) => ({
                                value: item.id,
                                label: item.program_name,
                            }))
                        }
                        className="w-full executor-block__name-field"
                        placeholder="Выберите заказчика"
                        noOptionsMessage={() => "Совпадений нет"}
                        isValidNewOption={() => false}
                        value={
                            (contragents.length > 0 &&
                                contragents
                                    .map((item) => ({
                                        value: item.id,
                                        label: item.program_name,
                                    }))
                                    .find(
                                        (option) =>
                                            option.value ===
                                            projectData?.contragent_id
                                    )) ||
                            null
                        }
                        onChange={(selectedOption) => {
                            const newValue = selectedOption?.value || null;

                            handleInputChange(newValue, "contragent_id");
                        }}
                    />
                )}
            </div>

            <div className="grid gap-2 flex-grow grid-cols-2 mt-2">
                <button
                    type="button"
                    className="border rounded-lg py-3 px-5 bg-black text-white"
                    onClick={() => {
                        customerType === "new"
                            ? (sendNewContragent(programName),
                              setAddCustomer(false))
                            : (updateProject(), setAddCustomer(false));
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
