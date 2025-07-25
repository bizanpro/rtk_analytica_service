import { useNavigate } from "react-router-dom";

import handleStatus from "../../utils/handleStatus";

const ProjectItem = ({ props, columns, mode, deleteProject }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/projects/${props.id}`, { state: { mode: "read" } });
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="border-b border-gray-300 py-2.5 min-w-[180px] max-w-[250px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {key === "latest_reports"
                                            ? value?.map((item, index) => (
                                                  <tr key={`${key}_${index}`}>
                                                      <td
                                                          className={`px-4 ${
                                                              index !==
                                                              value?.length - 1
                                                                  ? "pb-1"
                                                                  : "pt-1"
                                                          }`}
                                                      >
                                                          <div className="flex items-center gap-3 w-full">
                                                              <div
                                                                  className="text-lg"
                                                                  style={{
                                                                      flex: "0 0 90px",
                                                                  }}
                                                              >
                                                                  {
                                                                      item.report_period_code
                                                                  }
                                                              </div>

                                                              <div
                                                                  className={`rounded px-8 py-1 text-center flex-grow
                                                                        ${
                                                                            item
                                                                                .status
                                                                                ?.name ===
                                                                            "Завершен"
                                                                                ? "bg-green-400"
                                                                                : "bg-gray-200"
                                                                        }
                                                                    `}
                                                              >
                                                                  {
                                                                      item
                                                                          .status
                                                                          ?.name
                                                                  }
                                                              </div>
                                                          </div>
                                                      </td>
                                                  </tr>
                                              ))
                                            : value?.map((item, index) => (
                                                  <tr key={`${key}_${index}`}>
                                                      <td
                                                          className={`px-4 ${
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
                    key === "project_manager"
                        ? Object.entries(value).map(([subKey, subValue]) => (
                              <td
                                  className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                  key={subKey}
                              >
                                  {subValue?.full_name?.toString() || "—"}
                              </td>
                          ))
                        : Object.entries(value).map(([subKey, subValue]) => (
                              <td
                                  className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                  key={subKey}
                              >
                                  {subValue?.toString() || "—"}
                              </td>
                          ));
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
                                    {props.industry}
                                </span>
                            </td>
                        );
                    } else if (key === "status") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {handleStatus(value?.toString()) || "—"}
                            </td>
                        );
                    } else if (key === "implementation_period") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-2xl"
                                key={key}
                            >
                                <div className="flex items-end gap-1">
                                    <div className="flex items-end gap-1">
                                        {value?.toString() || "—"}{" "}
                                        <span className="text-base">мес.</span>
                                    </div>

                                    {props?.completion_percentage && (
                                        <div className="text-gray-300 border-gray-300 py-1 px-1 text-center border rounded-md text-sm">
                                            {Math.round(
                                                props?.completion_percentage
                                            )}
                                            %
                                        </div>
                                    )}
                                </div>

                                <div className="text-base">
                                    до {props?.implementation_period_end}
                                </div>
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
