import { IMaskInput } from "react-imask";

const ExecutorBlock = ({
    contanct,
    deleteBlock,
    handleChange,
    mode,
    banks,
    type,
}) => {
    const { id, full_name, phone, position, email, creditor_id } = contanct;
    const PhoneMask = "+{7}(000) 000 00 00";

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
                            value={full_name}
                            // disabled={mode == "read"}
                            readOnly
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <IMaskInput
                            mask={PhoneMask}
                            className="w-full"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            value={phone}
                            // onAccept={(el) => {
                            //     setFormFields({ ...formFields, ["phone"]: el });
                            // }}
                            placeholder="+7 999 999 99 99"
                            // disabled={mode == "read"}
                            readOnly
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
                            // disabled={mode == "read"}
                            readOnly
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            className="w-full"
                            type="email"
                            placeholder="mail@mail.ru"
                            value={email}
                            // disabled={mode == "read"}
                            readOnly
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
                            value={creditor_id}
                            // disabled={mode === "read"}
                            disabled
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

            {mode === "edit" ? (
                <div className="flex gap-[10px] items-center">
                    {/* <button
                        title="Обновить исполнителя"
                    >
                        <span className="update-icon"></span>
                    </button> */}
                    <button
                        className="delete-button"
                        title="Удалить исполнителя"
                        onClick={() => deleteBlock(id)}
                    >
                        <span className="delete-icon"></span>
                    </button>
                </div>
            ) : (
                <div className="h-[50px] w-[50px]"></div>
            )}
        </li>
    );
};

export default ExecutorBlock;
