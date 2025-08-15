import Hint from "../Hint/Hint";

const ProjectStatisticsBlockMobile = ({
    revenue,
    getRevenue,
    period,
    setPeriod,
}) => {
    return (
        <div className="statistics-block project-card__statistics-block">
            <nav className="card__tabs statistics-block__tabs">
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort_1"
                        id="this_year"
                        checked={period === "current_year"}
                        onChange={() => {
                            getRevenue();
                            setPeriod("current_year");
                        }}
                    />
                    <label
                        className="bg-gray-200 py-1 px-2 text-center rounded-md"
                        htmlFor="this_year"
                    >
                        Текущий год
                    </label>
                </div>
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort_1"
                        id="all_time"
                        checked={period === "all"}
                        onChange={() => {
                            getRevenue();
                            setPeriod("all");
                        }}
                    />
                    <label
                        className="bg-gray-200 py-1 px-2 text-center rounded-md"
                        htmlFor="all_time"
                    >
                        За всё время
                    </label>
                </div>
            </nav>

            <div className="statistics-block__content">
                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Выручка
                        <Hint message={"Выручка"} />
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
                                <strong>{revenue.revenue?.value}</strong>
                                <small>{revenue.revenue?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Поступления
                        <Hint message={"Поступления"} />
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
                                <strong>{revenue.receipts?.value}</strong>
                                <small>{revenue.receipts?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        ДЗ
                        <Hint message={"ДЗ"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.debts?.value + " " + revenue.debts?.label
                        }
                    >
                        {revenue.debts?.value !== "0" ? (
                            <div>
                                <strong>{revenue.debts?.value}</strong>
                                <small>{revenue.debts?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Валовая прибыль
                        <Hint message={"Валовая прибыль"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.gross_profit?.value +
                            " " +
                            revenue.gross_profit?.label
                        }
                    >
                        {revenue.gross_profit?.value !== "0" ? (
                            <>
                                <div>
                                    <strong>
                                        {revenue.gross_profit?.value}
                                    </strong>
                                    <small>{revenue.gross_profit?.label}</small>
                                </div>

                                {revenue.gross_margin?.value !== "0" && (
                                    <i>
                                        {revenue.gross_margin?.value}
                                        {revenue.gross_margin?.label} рент-ть
                                    </i>
                                )}
                            </>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        ФОТ
                        <Hint message={"ФОТ"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={revenue.fot?.value + " " + revenue.fot?.label}
                    >
                        {revenue.fot?.value !== "0" ? (
                            <>
                                <div>
                                    <strong>{revenue.fot?.value}</strong>
                                    <small>{revenue.fot?.label}</small>
                                </div>

                                {revenue.fot_percentage?.value !== "0" && (
                                    <i>
                                        {revenue.fot_percentage?.value}
                                        {revenue.fot_percentage?.label} от
                                        выручки
                                    </i>
                                )}
                            </>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Подрячики
                        <Hint message={"Подрячики"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.suppliers_expenses?.value +
                            " " +
                            revenue.suppliers_expenses?.label
                        }
                    >
                        {revenue.suppliers_expenses?.value !== "0" ? (
                            <>
                                <div>
                                    <strong>
                                        {revenue.suppliers_expenses?.value}
                                    </strong>
                                    <small>
                                        {revenue.suppliers_expenses?.label}
                                    </small>
                                </div>

                                {revenue.suppliers_fot_percentage?.value !==
                                    "0" && (
                                    <i>
                                        {
                                            revenue.suppliers_fot_percentage
                                                ?.value
                                        }
                                        {
                                            revenue.suppliers_fot_percentage
                                                ?.label
                                        }{" "}
                                        от выручки
                                    </i>
                                )}
                            </>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStatisticsBlockMobile;
