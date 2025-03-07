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
                if (key != "id" && key != "time_code") {
                    if (Array.isArray(value) && value.length > 1) {
                        return (
                            <td
                                className="border-b border-gray-300 min-w-[200px] py-2"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {value.map((item, index) => (
                                            <tr
                                                className={`${
                                                    index !== value.length - 1
                                                        ? "border-b border-gray-300"
                                                        : ""
                                                }`}
                                                key={`${key}_${index}`}
                                            >
                                                <td
                                                    className={`px-4 ${
                                                        index !==
                                                        value.length - 1
                                                            ? "pb-2"
                                                            : "pt-2"
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
                                    className="border-b border-gray-300 px-4 py-2 min-w-[200px]"
                                    key={subKey}
                                >
                                    {subValue.toString()}
                                </td>
                            )
                        );
                    } else {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2 min-w-[200px]"
                                key={key}
                            >
                                {value.toString()}
                            </td>
                        );
                    }
                }
            })}
        </tr>
    );
};

export default ProjectItem;
