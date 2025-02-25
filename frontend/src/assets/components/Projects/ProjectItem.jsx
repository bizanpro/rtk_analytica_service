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
            {Object.entries(props).map(([key, value]) => (
                <td
                    className="border border-gray-300 px-4 py-2 min-w-[150px]"
                    key={key}
                    style={{ verticalAlign: "stretch" }}
                >
                    {Array.isArray(value) ? (
                        <table>
                            <tbody>
                                {value.map((item, index) => (
                                    <tr
                                        className="border-b border-gray-300 transition"
                                        key={`${key}-${index}`}
                                    >
                                        <td>{item.toString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <span>{value.toString()}</span>
                    )}
                </td>
            ))}
        </tr>
    );
};

export default ProjectItem;
