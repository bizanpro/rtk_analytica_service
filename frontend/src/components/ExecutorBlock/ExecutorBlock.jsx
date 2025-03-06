import './ExecutroBlock.scss'

const ExecutorBlock = ({
    id,
    fullName,
    phone,
    position,
    email,
    isEditing,
    removeBlock,
    handleChange,
    handleBlur,
    data,
    method,
}) => {
    return (
        <li className="flex items-center justify-between gap-6">
            <div
                className={`executor-block flex-grow ${
                    isEditing ? "border border-black" : "border border-gray-300"
                } transition-all`}
            >
                <div className="grid grid-cols-[60%_40%] border-b border-gray-300">
                    <div className="p-1 border-r border-gray-300">
                        <input
                            type="text"
                            placeholder="ФИО"
                            value={fullName}
                            onChange={(e) =>
                                handleChange(
                                    id,
                                    "fullName",
                                    e.target.value,
                                    data,
                                    method
                                )
                            }
                            onBlur={() => handleBlur(id, data, method)}
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            type="tel"
                            placeholder="+7 999 999 99 99"
                            value={phone}
                            onChange={(e) =>
                                handleChange(
                                    id,
                                    "phone",
                                    e.target.value,
                                    data,
                                    method
                                )
                            }
                            onBlur={() => handleBlur(id, data, method)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-[60%_40%]">
                    <div className="p-1 border-r border-gray-300">
                        <input
                            type="text"
                            placeholder="Должность"
                            value={position}
                            onChange={(e) =>
                                handleChange(
                                    id,
                                    "position",
                                    e.target.value,
                                    data,
                                    method
                                )
                            }
                            onBlur={() => handleBlur(id, data, method)}
                        />
                    </div>
                    <div className="p-1 pr-3">
                        <input
                            type="email"
                            placeholder="mail@mail.ru"
                            value={email}
                            onChange={(e) =>
                                handleChange(
                                    id,
                                    "email",
                                    e.target.value,
                                    data,
                                    method
                                )
                            }
                            onBlur={() => handleBlur(id, data, method)}
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={() => removeBlock(id, data, method)}
                className="delete-button"
                title='Удалить исполнителя'
            >
                <svg
                    height="48"
                    width="48"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M41 48H7V7h34v41zM9 46h30V9H9v37z" />
                    <path d="M35 9H13V1h22v8zM15 7h18V3H15v4zM16 41a1 1 0 01-1-1V15a1 1 0 112 0v25a1 1 0 01-1 1zM24 41a1 1 0 01-1-1V15a1 1 0 112 0v25a1 1 0 01-1 1zM32 41a1 1 0 01-1-1V15a1 1 0 112 0v25a1 1 0 01-1 1z" />
                    <path d="M0 7h48v2H0z" />
                </svg>
            </button>
        </li>
    );
};

export default ExecutorBlock;
