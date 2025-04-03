const ProjectTeam = ({ teamData }) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-gray-400">Команда проекта</span>
            <div className="grid gap-8 mt-5 max-h-[250px] overflow-y-auto">
                {teamData?.map((teammate) => (
                    <div key={teammate.id} className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{teammate.name}</div>
                            <span className="text-sm">
                                {teammate.type === "person"
                                    ? "Сотрудник"
                                    : "Подрядчик"}
                            </span>
                        </div>
                        <div className="text-lg">{teammate.role_name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectTeam;
