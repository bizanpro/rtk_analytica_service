import { useState } from "react";

import CreatableSelect from "react-select/creatable";
import { IMaskInput } from "react-imask";

import "./ExecutorBlock.scss";

const CREDITOR_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
    creditor_id: 1,
};

const CUSTOMER_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
};

const EmptyExecutorBlock = ({
    removeBlock,
    banks,
    borderClass,
    type,
    sendExecutor,
    contragentContacts,
    creditorContacts,
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});

    const [newContact, setNewContact] = useState(
        type === "creditor" ? CREDITOR_TEMPLATE : CUSTOMER_TEMPLATE
    );

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const allContacts =
        type === "creditor"
            ? creditorContacts.flatMap((creditor) =>
                  creditor.projects.flatMap((project) =>
                      project.contacts.map((person) => ({
                          value: person.full_name,
                          label: person.full_name,
                          email: person.email,
                          phone: person.phone,
                          position: person.position,
                      }))
                  )
              )
            : contragentContacts.flatMap((contragent) =>
                  contragent.projects.flatMap((project) =>
                      project.responsible_persons.map((person) => ({
                          value: person.full_name,
                          label: person.full_name,
                          email: person.email,
                          phone: person.phone,
                          position: person.position,
                      }))
                  )
              );

    const handleNewExecutor = (e, name) => {
        setNewContact({
            ...newContact,
            [name]: name === "phone" ? e : e.target.value,
        });
    };

    const handleChange = (newValue) => {
        setNewContact({
            ...newContact,
            full_name: newValue.value,
            phone: newValue.phone,
            email: newValue.email,
            position: newValue.position,
        });
    };

    const handleSave = () => {
        const newErrors = {
            full_name: !newContact.full_name,
            phone: !newContact.phone,
            position: !newContact.position,
            email: !newContact.email || !validateEmail(newContact.email),
            creditor_id: type === "creditor" ? !newContact.creditor_id : false,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((err) => err)) return;

        sendExecutor(type, newContact);
    };

    return (
        <div className="flex items-center justify-between gap-6 w-full">
            <div
                className={`executor-block flex-grow border transition-all ${borderClass}`}
            >
                <div
                    className={`grid grid-cols-[60%_40%] border-b transition-all ${borderClass}`}
                >
                    <div className={`border-r transition-all ${borderClass}`}>
                        <CreatableSelect
                            isClearable
                            onChange={handleChange}
                            options={allContacts}
                            className="w-full executor-block__name-field"
                            isValidNewOption={() => false}
                            placeholder="Введите ФИО"
                            noOptionsMessage={() => "Совпадений нет"}
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-sm">
                                Заполните ФИО
                            </p>
                        )}
                    </div>
                    <div className="py-2 px-3">
                        <IMaskInput
                            mask={PhoneMask}
                            className="w-full h-full"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            onAccept={(value) =>
                                handleNewExecutor(value || "", "phone")
                            }
                            value={newContact.phone || ""}
                            placeholder="+7 999 999 99 99"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">
                                Заполните телефон
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-[60%_40%]">
                    <div
                        className={`py-2 px-3 border-r transition-all ${borderClass}`}
                    >
                        <input
                            className="w-full h-full"
                            type="text"
                            placeholder="Должность"
                            value={newContact.position}
                            onChange={(e) => handleNewExecutor(e, "position")}
                        />
                        {errors.position && (
                            <p className="text-red-500 text-sm">
                                Заполните должность
                            </p>
                        )}
                    </div>
                    <div className="py-2 px-3">
                        <input
                            className="w-full h-full"
                            type="email"
                            placeholder="mail@mail.ru"
                            value={newContact.email}
                            onChange={(e) => handleNewExecutor(e, "email")}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                Некорректный email
                            </p>
                        )}
                    </div>
                </div>

                {type === "creditor" && (
                    <div
                        className={`py-2 px-3 border-t transition-all ${borderClass}`}
                    >
                        <select
                            className="w-full h-full"
                            onChange={(e) =>
                                setNewContact({
                                    ...newContact,
                                    creditor_id: e.target.value,
                                })
                            }
                        >
                            <option value="">Выберите банк</option>
                            {banks?.map((bank) => (
                                <option value={bank.id} key={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        {errors.creditor_id && (
                            <p className="text-red-500 text-sm">
                                Выберите банк
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-[10px] items-center">
                <button title="Сохранить исполнителя" onClick={handleSave}>
                    <span className="save-icon"></span>
                </button>
                <button
                    className="delete-button"
                    title="Удалить исполнителя"
                    onClick={removeBlock}
                >
                    <span className="delete-icon"></span>
                </button>
            </div>
        </div>
    );
};

export default EmptyExecutorBlock;
