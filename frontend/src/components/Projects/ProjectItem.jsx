import { useNavigate } from "react-router-dom";

const ProjectItem = (props) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/projects/${props.id}`);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {Object.entries(props).map(([key, value]) => {
                if (
                    key === "name" ||
                    key === "client" ||
                    key === "credit_manager_bank_name" ||
                    key === "service_cost" ||
                    key === "implementation_period_start" ||
                    key === "project_manager" ||
                    key === "status"
                ) {
                    if (Array.isArray(value) && value.length > 1) {
                        return (
                            <td
                                className="border-b border-gray-300 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {value.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
                                                <td
                                                    className={`px-4 ${
                                                        index !==
                                                        value.length - 1
                                                            ? "pb-1"
                                                            : "pt-1"
                                                    }`}
                                                >
                                                    {item.toString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else if (typeof value === "object" && value !== null) {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td
                                    className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                    key={subKey}
                                >
                                    {subValue.toString()}
                                </td>
                            )
                        );
                    } else {
                        if (key === "name") {
                            return (
                                <td
                                    className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                    key={key}
                                >
                                    {value.toString()}
                                    <br />
                                    <span className="text-gray-400 text-sm">
                                        {props.sector}
                                    </span>
                                </td>
                            );
                        } else {
                            return (
                                <td
                                    className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                    key={key}
                                >
                                    {value.toString()}
                                </td>
                            );
                        }
                    }
                }
            })}
        </tr>
    );
};

export default ProjectItem;
