import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import CreatableSelect from "react-select/creatable";
import { IMaskInput } from "react-imask";

import "./ExecutorBlock.scss";

const CREDITOR_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
    creditor_id: "",
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
    projectId,
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});
    const [isReadonly, setIsReadonly] = useState(
        type === "creditor" ? true : false
    );
    const [creditorContacts, setCreditorContacts] = useState([]);
    const [allContacts, setAllContacts] = useState([]);

    const [newContact, setNewContact] = useState(
        type === "creditor" ? CREDITOR_TEMPLATE : CUSTOMER_TEMPLATE
    );

    const targetArray =
        type === "creditor" ? creditorContacts : contragentContacts;

    const [inputValue, setInputValue] = useState(newContact.full_name || "");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Получение доступных для добавления контактных лиц кредитора
    const getCreditorContacts = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/creditor/?project_id=${projectId}&creditor_id=${
                newContact.creditor_id
            }`
        ).then((response) => {
            if (response.status == 200) {
                setCreditorContacts(response.data.data);
            }
        });
    };

    const handleNewExecutor = (e, name) => {
        setNewContact({
            ...newContact,
            [name]: name === "phone" ? e : e.target.value,
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

    useEffect(() => {
        setAllContacts(
            targetArray?.map((person) => ({
                value: person.full_name,
                label: person.full_name,
                email: person.email,
                phone: person.phone,
                position: person.position,
            }))
        );
    }, [creditorContacts]);

    useEffect(() => {
        if (type === "creditor" && newContact.creditor_id != "") {
            getCreditorContacts();
            setIsReadonly(false);
        }
    }, [newContact.creditor_id]);

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
                            options={allContacts}
                            className="w-full executor-block__name-field"
                            placeholder="Введите ФИО"
                            noOptionsMessage={() => "Совпадений нет"}
                            isValidNewOption={() => false}
                            inputValue={inputValue}
                            onInputChange={(newVal, { action }) => {
                                if (action === "input-change") {
                                    setInputValue(newVal);
                                    setNewContact((prev) => ({
                                        ...prev,
                                        full_name: newVal,
                                    }));

                                    setIsReadonly(false);
                                }
                            }}
                            value={
                                newContact.full_name
                                    ? {
                                          label: newContact.full_name,
                                          value: newContact.full_name,
                                      }
                                    : null
                            }
                            onChange={(selectedOption) => {
                                if (selectedOption) {
                                    setNewContact({
                                        ...newContact,
                                        full_name: selectedOption.value,
                                        phone: selectedOption.phone || "",
                                        email: selectedOption.email || "",
                                        position: selectedOption.position || "",
                                    });

                                    setInputValue("");
                                    setIsReadonly(true);
                                } else {
                                    setNewContact((prev) => ({
                                        ...prev,
                                        full_name: "",
                                    }));
                                    setInputValue("");
                                    setIsReadonly(false);
                                }
                            }}
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
                            disabled={isReadonly}
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
                            disabled={isReadonly}
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
                            disabled={isReadonly}
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
