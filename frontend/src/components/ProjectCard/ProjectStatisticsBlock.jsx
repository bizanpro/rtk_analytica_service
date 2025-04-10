const ProjectStatisticsBlock = () => {
    return (
        <div className="border-2 border-gray-300 p-5 mb-5">
            <div className="flex flex-col gap-2 justify-between">
                <div className="switch gap-4 w-[70%] mb-5">
                    <div>
                        <input
                            type="radio"
                            name="time_sort"
                            id="this_year"
                            disabled
                            checked
                        />
                        <label
                            className="bg-gray-200 py-1 px-2 text-center rounded-md"
                            htmlFor="this_year"
                        >
                            Текущий год
                        </label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="time_sort"
                            id="all_time"
                            disabled
                        />
                        <label
                            className="bg-gray-200 py-1 px-2 text-center rounded-md"
                            htmlFor="all_time"
                        >
                            За всё время
                        </label>
                    </div>
                </div>
            </div>
            <div className="grid items-stretch grid-cols-3 gap-3 mb-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Выручка{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">10,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-gray-400">Поступления</div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">8,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        ДЗ{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">2,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
            </div>
            <div className="grid items-stretch grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center flex-grow gap-2 text-gray-400">
                        Валовая прибыль{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    Нет данных
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Подрячики{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">1,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Валовая рент.{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    Нет данных
                </div>
            </div>
        </div>
    );
};

export default ProjectStatisticsBlock;
