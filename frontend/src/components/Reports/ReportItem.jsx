const ReportItem = ({ columns, props, openReportEditor }) => {
    return (
        <tr
            className="registry-table__item transition text-base text-left cursor-pointer"
            onClick={() => {
                openReportEditor(props);
            }}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                let statusClass;

                if (key === "report_status") {
                    if (value.toLowerCase() === "завершен") {
                        statusClass = "registry-table__item-status_active";
                    } else if (
                        value.toLowerCase() === "в процессе" ||
                        value.toLowerCase() === "в работе"
                    ) {
                        statusClass = "registry-table__item-status_inprogress";
                    } else if (value === "active") {
                        statusClass = "registry-table__item-status_active";
                    }
                }

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className={`${
                                    key === "creditors"
                                        ? "w-[90px] max-w-[90px]"
                                        : "min-w-[110px] max-w-[135px]"
                                }`}
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {value?.map((item, index) => {
                                            let cellContent;

                                            if (key === "project_managers") {
                                                cellContent = (
                                                    <div className="hidden-group text-blue">
                                                        <div className="visible-text">
                                                            <div>
                                                                {item.name.toString() ||
                                                                    "—"}
                                                            </div>
                                                        </div>

                                                        <div className="hidden-text">
                                                            {item.name.toString() ||
                                                                "—"}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (key === "creditors") {
                                                cellContent =
                                                    item?.name?.toString();
                                            } else {
                                                cellContent = item?.toString();
                                            }

                                            return (
                                                <tr key={`${key}_${index}`}>
                                                    <td
                                                        className={`${
                                                            key === "creditors"
                                                                ? "w-[90px] max-w-[90px]"
                                                                : "min-w-[110px] max-w-[135px]"
                                                        } ${
                                                            index !==
                                                            value?.length - 1
                                                                ? "pb-1"
                                                                : "pt-1"
                                                        }`}
                                                    >
                                                        {cellContent}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="min-w-[110px] max-w-[135px]"
                                key={key}
                            >
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "project" || key === "contragent") {
                        return (
                            <td className="w-[130px] text-blue" key={key}>
                                <div className="hidden-group">
                                    <div className="visible-text">
                                        <div>
                                            {value?.name?.toString() || "—"}
                                        </div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.name?.toString() || "—"}
                                    </div>
                                </div>
                            </td>
                        );
                    } else {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td className="w-[130px]" key={subKey}>
                                    {subValue?.toString() || "—"}
                                </td>
                            )
                        );
                    }
                } else {
                    if (key === "report_period_code") {
                        return (
                            <td
                                className="min-w-[120px] max-w-[155px]"
                                key={key}
                            >
                                <div>{value?.toString() || "—"}</div>

                                <span className="min-w-[120px] text-[#98A2B3] whitespace-nowrap">
                                    {props?.report_period?.toString()}
                                </span>
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
                    } else if (key === "report_status") {
                        return (
                            <td className="w-[110px]" key={key}>
                                <div
                                    className={`registry-table__item-status ${statusClass}`}
                                >
                                    {value?.toString() || "—"}
                                </div>
                            </td>
                        );
                    } else if (key === "days") {
                        return (
                            <td className="w-[110px]" key={key}>
                                {value?.toString() || "—"}

                                <div className="min-w-[120px] text-[#98A2B3] whitespace-nowrap">
                                    {props?.execution_period_code}
                                </div>
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
                            <td
                                className="min-w-[110px] max-w-[120px]"
                                key={key}
                            >
                                {value?.toString() || "—"}
                            </td>
                        );
                    }
                }
            })}
        </tr>
    );
};

export default ReportItem;
