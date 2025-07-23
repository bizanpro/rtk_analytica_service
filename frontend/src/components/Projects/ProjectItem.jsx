import { useNavigate } from "react-router-dom";

import handleStatus from "../../utils/handleStatus";

const ProjectItem = ({ props, columns, mode, deleteProject }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/projects/${props.id}`, { state: { mode: "read" } });
    };

    return (
        <tr
            className="registry-table__item transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                let statusClass;

                if (key === "status") {
                    if (value === "completed") {
                        statusClass = "registry-table__item-status_completed";
                    } else if (value === "active") {
                        statusClass = "registry-table__item-status_active";
                    }
                }

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td className="w-[150px]" key={key}>
                                <table className="w-full">
                                    <tbody>
                                        {key === "latest_reports" ? (
                                            <tr>
                                                <td className="registry-table__item-last-report w-full">
                                                    {value?.map(
                                                        (item, index) => (
                                                            <div
                                                                className={`${
                                                                    item.status
                                                                        ?.name ===
                                                                    "Завершен"
                                                                        ? "completed"
                                                                        : ""
                                                                }`}
                                                                key={index}
                                                            >
                                                                {
                                                                    item.report_period_code
                                                                }
                                                            </div>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            value?.map((item, index) => (
                                                <tr key={`${key}_${index}`}>
                                                    <td
                                                        className={`w-[100px] ${
                                                            index !==
                                                            value?.length - 1
                                                                ? "pb-1"
                                                                : "pt-1"
                                                        }`}
                                                    >
                                                        {key === "creditors"
                                                            ? item.name
                                                            : item?.toString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td className="w-[150px]" key={key}>
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    key === "project_manager"
                        ? Object.entries(value).map(([subKey, subValue]) => (
                              <td className="w-[150px] text-blue" key={subKey}>
                                  {subValue?.full_name?.toString() || "—"}
                              </td>
                          ))
                        : Object.entries(value).map(([subKey, subValue]) => (
                              <td
                                  className="min-w-[180px] max-w-[200px]"
                                  key={subKey}
                              >
                                  {subValue?.toString() || "—"}
                              </td>
                          ));
                } else {
                    if (key === "name") {
                        return (
                            <td className="w-[150px] text-blue" key={key}>
                                {value?.toString() || "—"}
                            </td>
                        );
                    } else if (key === "project_manager") {
                        return (
                            <td className="w-[150px] text-blue" key={key}>
                                {value?.toString() || "—"}
                            </td>
                        );
                    } else if (key === "status") {
                        return (
                            <td className="w-[110px]" key={key}>
                                <div
                                    className={`registry-table__item-status ${statusClass}`}
                                >
                                    {handleStatus(value?.toString()) || "—"}
                                </div>
                            </td>
                        );
                    } else if (key === "project_budget") {
                        return (
                            <td
                                className="w-[100px] registry-table__item-budget"
                                key={key}
                            >
                                <b>{value?.toString() || "—"}</b>
                                <span>
                                    {value?.toString() ? "млрд руб." : ""}
                                </span>
                            </td>
                        );
                    } else if (key === "implementation_period") {
                        return (
                            <td
                                className="w-[127px] registry-table__item-period"
                                key={key}
                            >
                                {value?.toString() ? (
                                    <>
                                        <div className="flex items-end gap-[5px]">
                                            <b className="flex items-end gap-1">
                                                {value?.toString()}
                                                <span>мес.</span>
                                            </b>

                                            {props?.completion_percentage && (
                                                <span>
                                                    {Math.round(
                                                        props?.completion_percentage
                                                    )}
                                                    %
                                                </span>
                                            )}
                                        </div>

                                        <span>
                                            до{" "}
                                            {props?.implementation_period_end}
                                        </span>
                                    </>
                                ) : (
                                    "—"
                                )}
                            </td>
                        );
                    } else {
                        return (
                            <td className="w-[150px]" key={key}>
                                {value?.toString() || "—"}
                            </td>
                        );
                    }
                }
            })}
            <td className="w-[24px] h-[20px]">
                {mode === "edit" && (
                    <button
                        className="delete-icon flex-none w-[20px] h-[20px]"
                        title="Удалить проект"
                        onClick={(e) => {
                            deleteProject(props.id);
                            e.stopPropagation();
                        }}
                    ></button>
                )}
            </td>
        </tr>
    );
};

export default ProjectItem;
