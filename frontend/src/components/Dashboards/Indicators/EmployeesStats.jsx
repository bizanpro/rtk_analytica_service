import EmployeeMetrics from "./EmployeeMetrics";
import EmployeeItem from "./EmployeeItem";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Legend
);

import { Bar } from "react-chartjs-2";

const EmployeesStats = ({ employeeMetrics, setEmployeeFilters }) => {
    const horizontalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "",
            },
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                formatter: (value) => value,
            },
        },

        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 20
                            ? label.slice(0, 20) + "…"
                            : label;
                    },
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
        },
    };

    const EmployeeMetricsData = {
        labels: employeeMetrics.headcount_by_position?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: employeeMetrics.headcount_by_position?.map(
                    (item) => item.count
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.5,
            },
        ],
    };

    return (
        <section className="flex flex-col gap-8 border border-gray-300 p-4">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                Персонал
            </h2>

            <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                    <EmployeeMetrics {...employeeMetrics} />

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <select
                                className="border-2 h-[30px] p-1 border-gray-300 max-w-[175px] w-full"
                                onChange={(evt) =>
                                    setEmployeeFilters((prev) => ({
                                        ...prev,
                                        metric_type: [evt.target.value],
                                    }))
                                }
                            >
                                <option value="headcount">
                                    Численность, чел
                                </option>
                                <option value="gross_salary">
                                    ФОТ gross, млн руб.
                                </option>
                                <option value="average_salary">
                                    Средняя зп, тыс. руб.
                                </option>
                            </select>

                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                ?
                            </span>
                        </div>

                        <div className="h-[280px] overflow-x-hidden overflow-y-auto">
                            <div
                                style={{
                                    height: `${Math.max(
                                        280,
                                        (EmployeeMetricsData.labels?.length ||
                                            0) * 40
                                    )}px`,
                                }}
                            >
                                <Bar
                                    data={EmployeeMetricsData}
                                    options={horizontalOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="grid items-stretch grid-cols-5 gap-3 mb-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-medium">
                                Пришли
                            </div>
                            <div className="flex items-center flex-grow gap-2">
                                <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    <span>
                                        {employeeMetrics.hired_employees
                                            ?.length || 0}
                                    </span>
                                </strong>
                                <small className="text-sm">чел.</small>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-medium">
                                Ушли
                            </div>
                            <div className="flex items-center flex-grow gap-2">
                                <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    <span>
                                        {employeeMetrics.dismissed_employees
                                            ?.length || 0}
                                    </span>
                                </strong>
                                <small className="text-sm">чел.</small>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-7 max-h-[280px] overflow-x-hidden overflow-y-auto">
                        <div>
                            <div className="mb-3 font-medium">
                                Новые сотрудники
                            </div>

                            <ul className="flex flex-col gap-2">
                                {employeeMetrics.hired_employees?.length > 0 &&
                                    employeeMetrics.hired_employees.map(
                                        (item) => (
                                            <EmployeeItem
                                                key={item.id}
                                                {...item}
                                            />
                                        )
                                    )}
                            </ul>
                        </div>

                        <div>
                            <div className="mb-3 font-medium">
                                Ушедшие сотрудники
                            </div>

                            <ul className="flex flex-col gap-2">
                                {employeeMetrics.dismissed_employees?.length >
                                    0 &&
                                    employeeMetrics.dismissed_employees.map(
                                        (item) => (
                                            <EmployeeItem
                                                key={item.id}
                                                {...item}
                                            />
                                        )
                                    )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmployeesStats;
