import RateBlock from "../RateBlock";

const ProjectReportEditor = () => {
    const rateTitles = ["Общая", "Банк", "Заказчик", "Команда"];

    return (
        <div className="border border-gray-400 py-5 px-3">
            <div className="text-2xl w-full mb-3">ФТМ 1Q25</div>

            <div className="grid gap-3 grid-cols-2 mb-5">
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportYes"
                        readOnly
                    />
                    <label htmlFor="createReportYes">Создать отчёт</label>
                </div>
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportNo"
                        readOnly
                    />
                    <label htmlFor="createReportNo">
                        Запросить у руководителя
                    </label>
                </div>
            </div>

            <div>
                <span className="text-gray-400 block mb-3">Оценка</span>

                <div className="flex flex-col gap-2">
                    {rateTitles.map((title) => (
                        <RateBlock title={title} key={title} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectReportEditor;
