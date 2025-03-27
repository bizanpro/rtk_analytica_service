const ProjectLastReport = ({ lastReport }) => {
    return (
        <>
            <div className="grid grid-col-3 gap-3">
                <div className="rounded-md bg-gray-200 text-center px-2 py-1 w-[33%]">
                    Отчёт
                </div>
            </div>

            <div className="grid gap-8 mt-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-lg">Прохоров Серей Викторович</div>
                        <span className="text-sm">Сотрудник</span>
                    </div>
                    <div className="text-lg">Руководитель проекта</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-lg">ООО "ИЭС"</div>
                        <span className="text-sm">Подрядчик</span>
                    </div>
                    <div className="text-lg">Технология</div>
                </div>
            </div>
        </>
    );
};

export default ProjectLastReport;
