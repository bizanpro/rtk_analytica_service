const ContragentResponsiblePersons = ({ teamData }: { teamData: object[] }) => {
    return (
        <ul className="project-card__team-list">
            {teamData && teamData.length > 0 ? (
                teamData?.map((teammate) => (
                    <li
                        key={teammate.id}
                        className="project-card__team-list-item"
                    >
                        <b>{teammate.full_name}</b>
                        <span>{teammate.position}</span>

                        <span>{teammate.phone}</span>
                        <span>{teammate.email}</span>
                    </li>
                ))
            ) : (
                <li className="project-card__team-list-nodata">Нет данных</li>
            )}
        </ul>
    );
};

export default ContragentResponsiblePersons;
