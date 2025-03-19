import { useState } from "react";
import { IMaskInput } from "react-imask";

const EmptyExecutorBlock = ({
    removeBlock,
    handleNewExecutor,
    banks,
    borderClass,
    type,
    sendExecutor,
    data,
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = () => {
        const newErrors = {
            full_name: !data.full_name,
            phone: !data.phone,
            position: !data.position,
            email: !data.email || !validateEmail(data.email),
            creditor_id: type === "lender" ? !data.creditor_id : false,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((err) => err)) return;

        sendExecutor(type);
    };

    return (
        <li className="flex items-center justify-between gap-6">
            <div
                className={`executor-block flex-grow border transition-all ${borderClass}`}
            >
                <div
                    className={`grid grid-cols-[60%_40%] border-b transition-all ${borderClass}`}
                >
                    <div
                        className={`p-1 border-r transition-all ${borderClass}`}
                    >
                        <input
                            className="w-full"
                            type="text"
                            placeholder="ФИО"
                            onChange={(e) =>
                                handleNewExecutor(type, e, "full_name")
                            }
                            value={data.full_name}
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-sm">
                                Заполните ФИО
                            </p>
                        )}
                    </div>
                    <div className="p-1 pr-3">
                        <IMaskInput
                            mask={PhoneMask}
                            className="w-full"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            onAccept={(value) =>
                                handleNewExecutor(type, value || "", "phone")
                            }
                            value={data.phone || ""}
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
                        className={`p-1 border-r transition-all ${borderClass}`}
                    >
                        <input
                            className="w-full"
                            type="text"
                            placeholder="Должность"
                            value={data.position}
                            onChange={(e) =>
                                handleNewExecutor(type, e, "position")
                            }
                        />
                        {errors.position && (
                            <p className="text-red-500 text-sm">
                                Заполните должность
                            </p>
                        )}
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            className="w-full"
                            type="email"
                            placeholder="mail@mail.ru"
                            value={data.email}
                            onChange={(e) =>
                                handleNewExecutor(type, e, "email")
                            }
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                Некорректный email
                            </p>
                        )}
                    </div>
                </div>

                {type === "lender" && (
                    <div
                        className={`p-1 border-t transition-all ${borderClass}`}
                    >
                        <select
                            className="w-full"
                            onChange={(e) =>
                                handleNewExecutor(type, e, "creditor_id")
                            }
                            value={data.creditor_id}
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
        </li>
    );
};

export default EmptyExecutorBlock;
