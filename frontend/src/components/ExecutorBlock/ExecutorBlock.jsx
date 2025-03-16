const ExecutorBlock = ({
    person,
    removeBlock,
    handleChange,
    data,
    method,
    mode,
    banks,
    type,
}) => {
    const { id, fullName, phone, position, email } = person;

    return (
        <li className="flex items-center justify-between gap-6">
            <div
                className={`executor-block flex-grow border transition-all ${
                    mode === "edit" ? "border-gray-300" : "border-transparent"
                }`}
            >
                <div
                    className={`grid grid-cols-[60%_40%] border-b transition-all ${
                        mode === "edit"
                            ? "border-gray-300"
                            : "border-transparent"
                    }`}
                >
                    <div
                        className={`p-1 border-r transition-all ${
                            mode === "edit"
                                ? "border-gray-300"
                                : "border-transparent"
                        }`}
                    >
                        <input
                            className="w-full"
                            type="text"
                            placeholder="ФИО"
                            value={fullName}
                            disabled={mode == "read"}
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            className="w-full"
                            type="tel"
                            placeholder="+7 999 999 99 99"
                            value={phone}
                            disabled={mode == "read"}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-[60%_40%]">
                    <div
                        className={`p-1 border-r transition-all ${
                            mode === "edit"
                                ? "border-gray-300"
                                : "border-transparent"
                        }`}
                    >
                        <input
                            className="w-full"
                            type="text"
                            placeholder="Должность"
                            value={position}
                            disabled={mode == "read"}
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            className="w-full"
                            type="email"
                            placeholder="mail@mail.ru"
                            value={email}
                            disabled={mode == "read"}
                        />
                    </div>
                </div>

                {type === "lender" && (
                    <div
                        className={`p-1 border-t transition-all ${
                            mode === "edit"
                                ? "border-gray-300"
                                : "border-transparent"
                        }`}
                    >
                        <select
                            className="w-full"
                            value={person.bank}
                            disabled={mode === "read"}
                        >
                            {banks?.map((bank) => (
                                <option value={bank.id} key={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* {mode === "edit" ? (
                <div className="flex gap-[10px] items-center">
                    <button
                        title="Обновить исполнителя"
                    >
                        <span className="update-icon"></span>
                    </button>
                    <button
                        className="delete-button"
                        title="Удалить исполнителя"
                    >
                        <span className="delete-icon"></span>
                    </button>
                </div>
            ) : (
                <div className="h-[50px] w-[50px]"></div>
            )} */}
        </li>
    );
};

export default ExecutorBlock;
