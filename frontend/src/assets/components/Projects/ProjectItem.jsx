import { useNavigate } from "react-router-dom";

const ProjectItem = ({
    id,
    time_code,
    name,
    type,
    status,
    payment,
    debt_bank,
    debt_manager,
    sector,
    services,
    credit_bank,
    credit_manager,
    plan_start,
    plan_end,
    team_member,
    salary,
    role,
    engagement,
    work_hours,
    subcontractor,
    sub_role,
    service_cost,
    sub_start,
    sub_end,
}) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/projects/${id}`);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer"
            onClick={handleRowClick}
        >
            <td className="border border-gray-300 px-4 py-2">{id}</td>
            <td className="border border-gray-300 px-4 py-2">{time_code}</td>
            <td className="border border-gray-300 px-4 py-2">{name}</td>
            <td className="border border-gray-300 px-4 py-2">{type}</td>
            <td className="border border-gray-300 px-4 py-2">{status}</td>
            <td className="border border-gray-300 px-4 py-2">{payment}</td>
            <td className="border border-gray-300 px-4 py-2">{debt_bank}</td>
            <td className="border border-gray-300 px-4 py-2">{debt_manager}</td>
            <td className="border border-gray-300 px-4 py-2">{sector}</td>
            <td className="border border-gray-300 px-4 py-2">{services}</td>
            <td className="border border-gray-300 px-4 py-2">{credit_bank}</td>
            <td className="border border-gray-300 px-4 py-2">
                {credit_manager}
            </td>
            <td className="border border-gray-300 px-4 py-2">{plan_start}</td>
            <td className="border border-gray-300 px-4 py-2">{plan_end}</td>
            <td className="border border-gray-300 px-4 py-2">{team_member}</td>
            <td className="border border-gray-300 px-4 py-2">{salary}</td>
            <td className="border border-gray-300 px-4 py-2">{role}</td>
            <td className="border border-gray-300 px-4 py-2">{engagement}</td>
            <td className="border border-gray-300 px-4 py-2">{work_hours}</td>
            <td className="border border-gray-300 px-4 py-2">
                {subcontractor}
            </td>
            <td className="border border-gray-300 px-4 py-2">{sub_role}</td>
            <td className="border border-gray-300 px-4 py-2">{service_cost}</td>
            <td className="border border-gray-300 px-4 py-2">{sub_start}</td>
            <td className="border border-gray-300 px-4 py-2">{sub_end}</td>
        </tr>
    );
};

export default ProjectItem;
