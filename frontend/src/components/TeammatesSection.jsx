const TeammatesSection = ({
    index,
    handleTeammateChange,
    physicalPersons,
    roles,
    person,
    removeTeammate,
    mode,
}) => {
    return (
        <div className="grid items-center gap-3 grid-cols-2">
            <div className="flex flex-col gap-2 justify-between">
                <div className="border-2 border-gray-300 p-1 h-[32px]">
                    <select
                        className="w-full h-full"
                        value={person?.physical_person_id}
                        onChange={(e) =>
                            handleTeammateChange(
                                index,
                                "physical_person_id",
                                Number(e.target.value)
                            )
                        }
                        disabled={mode === "read" ? true : false}
                    >
                        <option value="0">Выберите сотрудника</option>
                        {physicalPersons.map((person) => (
                            <option value={person.id} key={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2 justify-between flex-grow">
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
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
