import { useNavigate } from "react-router-dom";

const ProjectItem = (props) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/projects/${props.id}`);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer"
            onClick={handleRowClick}
        >
            {Object.entries(props).map(([key, value]) => {
                if (Array.isArray(value) && value.length > 1) {
                    return (
                        <td
                            className="border border-gray-300 min-w-[150px]"
                            key={key}
                            style={{ verticalAlign: "stretch" }}
                        >
                            <table className="w-full">
                                <tbody>
                                    {value.map((item, index) => (
                                        <tr
                                            className="border-b border-gray-300"
                                            key={`${key}_${index}`}
                                        >
                                            <td className="py-1.5 px-4">
                                                {item.toString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    );
                } else if (typeof value === "object" && value !== null) {
                    return Object.entries(value).map(([subKey, subValue]) => (
                        <td
                            className="border border-gray-300 px-4 py-2 min-w-[150px]"
                            key={subKey}
                            style={{ verticalAlign: "stretch" }}
                        >
                            {subValue.toString()}
                        </td>
                    ));
                } else {
                    return (
                        <td
                            className="border border-gray-300 px-4 py-2 min-w-[150px]"
                            key={key}
                            style={{ verticalAlign: "stretch" }}
                        >
                            {value.toString()}
                        </td>
                    );
                }
            })}
        </tr>
    );
};

export default ProjectItem;
