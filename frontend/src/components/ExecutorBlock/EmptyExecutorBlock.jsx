import { IMaskInput } from "react-imask";

const EmptyExecutorBlock = ({
    removeBlock,
    handleNewExecutor,
    banks,
    borderClass,
    type,
    sendExecutor,
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

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
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <IMaskInput
                            mask={PhoneMask}
                            className="w-full"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            onAccept={(e) =>
                                handleNewExecutor(type, e, "phone")
                            }
                            placeholder="+7 999 999 99 99"
                        />
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
                            onChange={(e) =>
                                handleNewExecutor(type, e, "position")
                            }
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            className="w-full"
                            type="email"
                            placeholder="mail@mail.ru"
                            onChange={(e) =>
                                handleNewExecutor(type, e, "email")
                            }
                        />
                    </div>
                </div>

                {type === "lender" && (
                    <div
                        className={`p-1 border-t transition-all ${borderClass}`}
                    >
                        <select
                            className="w-full"
                            onChange={(e) =>
                                handleNewExecutor(type, e, "bank_id")
                            }
                        >
                            <option value="">Банк</option>
                            {banks?.map((bank) => (
                                <option value={bank.id} key={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex gap-[10px] items-center">
                <button
                    title="Сохранить исполнителя"
                    onClick={() => sendExecutor(type)}
                >
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
