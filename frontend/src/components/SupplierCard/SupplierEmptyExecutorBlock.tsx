import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import SelectList from "../MultiSelect/SelectList";
import Popup from "../Popup/Popup";
import { IMaskInput } from "react-imask";

import "../ExecutorBlock/ExecutorBlock.scss";

const CUSTOMER_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const SupplierEmptyExecutorBlock = ({
    removeBlock,
    sendExecutor,
    supplierId,
}: {
    removeBlock: () => void;
    sendExecutor: () => void;
    supplierId: number;
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});
    const [isReadonly, setIsReadonly] = useState(false);

    const [contactsList, setContactsList] = useState([]);
    const [allContacts, setAllContacts] = useState([]);

    const [newContact, setNewContact] = useState(CUSTOMER_TEMPLATE);

    const [activeTab, setActiveTab] = useState("create");
    const [isFilled, setIsFilled] = useState(false);

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
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((err) => err)) return;
        sendExecutor(newContact);
    };

    // Получение доступных для добавления контактных лиц заказчика
    const getContragentsContacts = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/supplier?supplier_id=${supplierId}`
        ).then((response) => {
            if (response.status == 200) {
                setContactsList(response.data.data);
            }
        });
    };

    useEffect(() => {
        getContragentsContacts();
    }, []);

    useEffect(() => {
        setAllContacts(
            contactsList?.map((person) => ({
                value: person.full_name,
                label: person.full_name,
                email: person.email,
                phone: person.phone,
                position: person.position,
            }))
        );
    }, [contactsList]);

    useEffect(() => {
        setIsFilled(
            Object.values(newContact).every((value) => {
                if (typeof value === "string") {
                    return value.trim() !== "";
                }
                return value !== null && value !== undefined;
            })
        );
    }, [newContact]);

    return (
        <Popup onClick={removeBlock} title="Добавить ключевое лицо">
            <div className="action-form__body executor-block">
                <div className="executor-block__header">
                    <ul className="card__tabs executor-block__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                id="create_executor"
                                type="radio"
                                name="create_executor"
                                checked={activeTab === "create"}
                                onChange={() => setActiveTab("create")}
                            />
                            <label htmlFor="create_executor">Создать</label>
                        </li>
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                id="select_executor"
                                type="radio"
                                name="select_executor"
                                checked={activeTab === "select"}
                                onChange={() => setActiveTab("select")}
                            />
                            <label htmlFor="select_executor">
                                Выбрать из списка
                            </label>
                        </li>
                    </ul>
                </div>

                {activeTab === "create" ? (
                    <div className="executor-block__form">
                        <div className="relative">
                            <input
                                type="text"
                                className={`form-field w-full ${
                                    errors.full_name ? "form-field_error" : ""
                                }`}
                                placeholder="ФИО*"
                                value={newContact.full_name}
                                onChange={(evt) =>
                                    setNewContact((prev) => ({
                                        ...prev,
                                        full_name: evt.target.value,
                                    }))
                                }
                                disabled={isReadonly}
                            />

                            {errors.full_name && (
                                <p className="message message-error">
                                    Заполните ФИО
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                className={`form-field w-full ${
                                    errors.position ? "form-field_error" : ""
                                }`}
                                type="text"
                                placeholder="Должность"
                                value={newContact.position}
                                onChange={(e) =>
                                    handleNewExecutor(e, "position")
                                }
                                disabled={isReadonly}
                            />
                            {errors.position && (
                                <p className="message message-error">
                                    Заполните должность
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                className={`form-field w-full ${
                                    errors.email ? "form-field_error" : ""
                                }`}
                                type="email"
                                placeholder="E-mail"
                                value={newContact.email}
                                onChange={(e) => handleNewExecutor(e, "email")}
                                disabled={isReadonly}
                            />
                            {errors.email && (
                                <p className="message message-error">
                                    Некорректный email
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <IMaskInput
                                mask={PhoneMask}
                                className={`form-field w-full ${
                                    errors.phone ? "form-field_error" : ""
                                }`}
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                onAccept={(value) =>
                                    handleNewExecutor(value || "", "phone")
                                }
                                value={newContact.phone || ""}
                                placeholder="Телефон"
                                disabled={isReadonly}
                            />
                            {errors.phone && (
                                <p className="message message-error">
                                    Заполните телефон
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <SelectList
                        options={allContacts}
                        selectedContact={newContact}
                        onChange={(selected) => {
                            if (selected) {
                                setNewContact({
                                    ...newContact,
                                    full_name: selected.value,
                                    phone: selected.phone || "",
                                    email: selected.email || "",
                                    position: selected.position || "",
                                });

                                setIsReadonly(true);
                                setActiveTab("create");
                            } else {
                                setNewContact({
                                    ...newContact,
                                    full_name: "",
                                    phone: "",
                                    email: "",
                                    position: "",
                                });
                                setIsReadonly(false);
                                setActiveTab("create");
                            }
                        }}
                    />
                )}
            </div>

            <div className="action-form__footer">
                <div className="max-w-[280px]">
                    <button
                        type="button"
                        onClick={removeBlock}
                        className="cancel-button flex-[1_0_auto]"
                    >
                        Отменить
                    </button>

                    <button
                        type="button"
                        className="action-button flex-[1_0_auto]"
                        onClick={handleSave}
                        disabled={!isFilled}
                        title="Добавить исполнителя"
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default SupplierEmptyExecutorBlock;
