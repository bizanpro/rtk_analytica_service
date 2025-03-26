const TeammatesSection = ({
    index,
    handleTeammateChange,
    physicalPersons,
    roles,
}) => {
    return (
        <div className="grid gap-3 grid-cols-2">
            <div className="flex flex-col gap-2 justify-between">
                <div className="border-2 border-gray-300 p-1 h-[32px]">
                    <select
                        className="w-full"
                        onChange={(e) =>
                            handleTeammateChange(
                                index,
                                "physical_person_id",
                                Number(e.target.value)
                            )
                        }
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
            <div className="flex flex-col gap-2 justify-between">
                <div className="border-2 border-gray-300 p-1 h-[32px]">
                    <select
                        className="w-full"
                        onChange={(e) =>
                            handleTeammateChange(
                                index,
                                "role_id",
                                Number(e.target.value)
                            )
                        }
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
        </div>
    );
};

export default TeammatesSection;
