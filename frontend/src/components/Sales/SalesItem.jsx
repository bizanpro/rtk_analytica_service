import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const SalesItem = ({ props, columns, deleteProject }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/sales/${props.id}`, { state: { mode: "read" } });
    };

    const getNestedValue = (obj, path) => {
        return path.split(".").reduce((acc, part) => {
            return acc && acc[part];
        }, obj);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = key.includes(".")
                    ? getNestedValue(props, key)
                    : props[key];

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="border-b border-gray-300 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {key === "services"
                                            ? value.map((item, index) => (
                                                  <tr key={`${key}_${index}`}>
                                                      <td
                                                          className={`px-4 ${
                                                              index !==
                                                              value.length - 1
                                                                  ? "pb-1"
                                                                  : "pt-1"
                                                          }`}
                                                      >
                                                          {item?.name?.toString()}
                                                      </td>
                                                  </tr>
                                              ))
                                            : value.map((item, index) => (
                                                  <tr key={`${key}_${index}`}>
                                                      <td
                                                          className={`px-4 ${
                                                              index !==
                                                              value.length - 1
                                                                  ? "pb-1"
                                                                  : "pt-1"
                                                          }`}
                                                      >
                                                          {key === "creditors"
                                                              ? item.name
                                                              : item?.toString()}
                                                      </td>
                                                  </tr>
                                              ))}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "contragent") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {value?.program_name?.toString() || "—"}
                            </td>
                        );
                    } else if (key === "request_source") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {value?.name?.toString() || "—"}
                            </td>
                        );
                    } else {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td
                                    className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                    key={subKey}
                                >
                                    {subValue?.toString() || "—"}
                                </td>
                            )
                        );
                    }
                } else {
                    if (key === "name") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {value?.toString() || "—"}
                                <br />
                                <span className="text-gray-400 text-sm">
                                    {props?.industry?.name}
                                </span>
                            </td>
                        );
                    } else if (
                        (key === "request_date" || key === "status_date") &&
                        value !== null
                    ) {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {format(parseISO(value), "dd.MM.yyyy", {
                                    locale: ru,
                                }) || "—"}
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {value?.toString() || "—"}
                            </td>
                        );
                    }
                }
            })}

            <td className="w-[24px] h-[20px]">
                <button
                    className="delete-icon flex-none w-[20px] h-[20px]"
                    title="Удалить проект"
                    onClick={(e) => {
                        deleteProject(props.id);
                        e.stopPropagation();
                    }}
                ></button>
            </td>
        </tr>
    );
};

export default SalesItem;
