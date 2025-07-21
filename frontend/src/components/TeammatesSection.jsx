import CreatableSelect from "react-select/creatable";

const TeammatesSection = ({
    index,
    handleTeammateChange,
    physicalPersons,
    roles,
    person,
    removeTeammate,
    mode,
}) => {
    let name;

    if (mode == "read") {
        name =
            physicalPersons.length > 0 &&
            physicalPersons.find(
                (item) => item.id === person?.physical_person_id
            ).name;
    }

    return (
        <div className="grid items-center gap-3 grid-cols-2">
            <div className="flex flex-col gap-2 justify-between">
                <div
                    className={`border-2 border-gray-300 flex items-center ${
                        mode == "read" ? "h-[32px] p-1" : ""
                    }`}
                >
                    {mode === "read" ? (
                        <span
                            className="whitespace-nowrap w-full truncate"
                            title={name}
                        >
                            {name}
                        </span>
                    ) : (
                        <CreatableSelect
                            isClearable
                            options={
                                physicalPersons.length > 0 &&
                                physicalPersons.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))
                            }
                            className="w-full executor-block__name-field"
                            placeholder="Выбрать исполнителя"
                            noOptionsMessage={() => "Совпадений нет"}
                            isValidNewOption={() => false}
                            defaultValue={
                                (physicalPersons.length > 0 &&
                                    physicalPersons
                                        .map((item) => ({
                                            value: item.id,
                                            label: item.name,
                                        }))
                                        .find(
                                            (option) =>
                                                option.value ===
                                                person?.physical_person_id
                                        )) ||
                                null
                            }
                            onChange={(selectedOption) => {
                                handleTeammateChange(
                                    index,
                                    "physical_person_id",
                                    selectedOption.value
                                );
                            }}
                            isDisabled={mode == "read"}
                        />
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2 justify-between flex-grow">
                    <div
                        className={`border-2 border-gray-300 p-1 ${
                            mode == "read" ? "h-[32px]" : "h-[42px]"
                        }`}
                    >
                        <select
                            className="w-full h-full"
                            value={person?.role_id}
                            onChange={(e) =>
                                handleTeammateChange(
                                    index,
                                    "role_id",
                                    Number(e.target.value)
                                )
                            }
                            disabled={mode === "read" ? true : false}
                        >
                            <option value="0">Выберите роль</option>
                            {roles.map((role) => (
                                <option value={role.id} key={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {mode === "edit" && (
                    <button
                        className="delete-icon w-[30px] h-[32px]"
                        title="Удалить исполнителя"
                        onClick={() => removeTeammate(index)}
                    ></button>
                )}
            </div>
        </div>
    );
};

export default TeammatesSection;
