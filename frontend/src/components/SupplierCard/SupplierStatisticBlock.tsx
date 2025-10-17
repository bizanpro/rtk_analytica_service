import { useEffect } from "react";

import CountUp from "react-countup";
import Hint from "../Hint/Hint";

const SupplierStatisticBlock = ({
    revenue,
    supplierId,
    activeProject,
    getRevenue,
    period,
    setPeriod,
}: {
    revenue: object[];
    supplierId: number;
    activeProject: number;
    getRevenue: () => void;
    period: string;
    setPeriod: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const URL =
        activeProject != null
            ? `${
                  import.meta.env.VITE_API_URL
              }contragents/${supplierId}/projects/${activeProject}/supplier-metrics/?period=${period}`
            : `${
                  import.meta.env.VITE_API_URL
              }contragents/${supplierId}/supplier-metrics?period=${period}`;

    useEffect(() => {
        getRevenue(URL);
    }, [period, activeProject]);

    return (
        <div className="statistics-block project-card__statistics-block">
            <nav className="card__tabs statistics-block__tabs">
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort"
                        id="this_year"
                        checked={period === "current_year"}
                        onChange={() => setPeriod("current_year")}
                    />
                    <label htmlFor="this_year">Текущий год</label>
                </div>
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort"
                        id="all_time"
                        checked={period === "all"}
                        onChange={() => setPeriod("all")}
                    />
                    <label htmlFor="all_time">За всё время</label>
                </div>
            </nav>

            <div className="statistics-block__content">
                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Выполнено
                        <Hint message={"Выполнено"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.revenue?.value +
                            " " +
                            revenue.revenue?.label
                        }
                    >
                        {revenue.revenue?.value !== "0" ? (
                            <div>
                                <strong>
                                    <CountUp
                                        end={parseFloat(
                                            revenue.revenue?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )}
                                        duration={1}
                                        separator=" "
                                        decimals={2}
                                    />
                                </strong>
                                <small>{revenue.revenue?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Оплачено
                        <Hint message={"Оплачено"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.receipts?.value +
                            " " +
                            revenue.receipts?.label
                        }
                    >
                        {revenue.receipts?.value !== "0" ? (
                            <div>
                                <strong>
                                    <CountUp
                                        end={parseFloat(
                                            revenue.receipts?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )}
                                        duration={1}
                                        separator=" "
                                        decimals={2}
                                    />
                                </strong>
                                <small>{revenue.receipts?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        КЗ
                        <Hint message={"КЗ"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.debts?.value + " " + revenue.debts?.label
                        }
                    >
                        {revenue.debts?.value !== "0" ? (
                            <div>
                                <strong>
                                    <CountUp
                                        end={parseFloat(
                                            revenue.debts?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )}
                                        duration={1}
                                        separator=" "
                                        decimals={2}
                                    />
                                </strong>
                                <small>{revenue.debts?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierStatisticBlock;
