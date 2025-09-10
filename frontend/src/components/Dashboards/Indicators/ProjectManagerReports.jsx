const ProjectManagerReports = () => {
    return (
        <div className="flex flex-col gap-3 border border-gray-300 p-4">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-balance">
                Отчёты руководителей проектов (20)
            </h2>

            <ul className="max-h-[280px] overflow-x-hidden overflow-y-auto p-2 flex flex-col gap-3">
                <li className="grid items-center grid-cols-[1fr_80px_120px_100px_50px] justify-between gap-3 pb-2 text-gray-400 border-b border-gray-300">
                    <span>Проект</span>
                    <span>Месяц</span>
                    <span>Рук.</span>
                    <span>Статус</span>
                    <span>Оценка</span>
                </li>
            </ul>
        </div>
    );
};

export default ProjectManagerReports;
