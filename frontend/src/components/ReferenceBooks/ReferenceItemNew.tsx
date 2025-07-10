interface Positions {
    name: string;
    id: number;
}

interface FormFields {
    [key: string]: string;
}
interface Columns {
    label: string;
    key: string;
}

interface Props {
    columns: Columns[];
    formFields: FormFields;
    bookId: string;
    positions: Positions[];
    handleNewElementInputChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => void;
    addNewElement: () => void;
}

const ReferenceItemNew = ({
    columns,
    formFields,
    bookId,
    positions,
    handleNewElementInputChange,
    addNewElement,
}: Props) => {
    return (
        <tr className="border-gray-300 text-base border-b text-left">
            {columns.map(({ key }) => (
                <td key={key} className="px-4 py-7 min-w-[180px] max-w-[200px]">
                    {key === "name" ||
                    key === "counterparty_name" ||
                    key === "full_name" ? (
                        <div key={key} className="flex items-center gap-2">
                            <input
                                type="text"
                                className="w-full"
                                placeholder="Новый элемент"
                                name={key}
                                value={formFields[key] || ""}
                                onChange={(e) =>
                                    handleNewElementInputChange(e, key)
                                }
                            />
                        </div>
                    ) : key === "type" || key === "position_id" ? (
                        <select
                            className="w-full border border-gray-300 min-h-[30px]"
                            name={key}
                            value={formFields[key] || ""}
                            onChange={(e) =>
                                handleNewElementInputChange(e, key)
                            }
                        >
                            {bookId === "management-report-types" ? (
                                <>
                                    <option value="">Должность</option>
                                    {positions.map((position) => (
                                        <option
                                            value={position.id}
                                            key={position.id}
                                        >
                                            {position.name}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <option value="">Тип</option>
                                    <option value="one_to_one">
                                        Один к одному
                                    </option>
                                    <option value="one_to_many">
                                        Один ко многим
                                    </option>
                                </>
                            )}
                        </select>
                    ) : key === "is_regular" ? (
                        <select
                            className="w-full border border-gray-300 min-h-[30px]"
                            name={key}
                            defaultValue=""
                            onChange={(e) =>
                                handleNewElementInputChange(e, key)
                            }
                        >
                            <option value="">Выбрать</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </select>
                    ) : key === "show_cost" ? (
                        <select
                            className="w-full border border-gray-300 min-h-[30px]"
                            name={key}
                            defaultValue=""
                            onChange={(e) =>
                                handleNewElementInputChange(e, key)
                            }
                        >
                            <option value="">Выбрать</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </select>
                    ) : key === "is_project_report_responsible" ? (
                        <select
                            className="w-full border border-gray-300 min-h-[30px]"
                            name={key}
                            defaultValue=""
                            onChange={(e) =>
                                handleNewElementInputChange(e, key)
                            }
                        >
                            <option value="">Выбрать</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </select>
                    ) : (
                        "—"
                    )}
                </td>
            ))}
            <td className="px-4 py-7 min-w-[50px] text-center">
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        className="save-icon"
                        style={{
                            opacity: formFields.name?.length > 1 ? 1 : 0,
                        }}
                        onClick={addNewElement}
                    ></button>
                </div>
            </td>
        </tr>
    );
};

export default ReferenceItemNew;
