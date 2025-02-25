import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postData from "../../utils/postData";

const ProjectCard = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState({});

    useEffect(() => {
        postData("POST", "../../../src/data/projects.json", {}).then(
            (response) => {
                const data = response.find((item) => item.id == projectId);
                console.log(data);

                setProjectData(data);
            }
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <a href="/projects" className="flex items-center gap-3 mb-5 text-lg">
                    <span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 20l-8-8 8-8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    Назад
                </a>

                <h1 className="text-4xl mb-8">Карточка проекта</h1>

                {projectData && Object.keys(projectData).length > 0 ? (
                    <div className="project-card__wrapper flex flex-col gap-10 text-lg">
                        <div className="project-card__header flex gap-10">
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">
                                    ID проекта
                                </span>
                                <div>{projectData.id}</div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Time code</span>
                                <div>{projectData.time_code}</div>
                            </div>
                        </div>

                        <div className="project-card__body grid grid-cols-3 gap-5">
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Название</span>
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 p-5"
                                    value={projectData.name}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Тип</span>
                                <select className="border-2 border-gray-300 p-5">
                                    <option value={projectData.type}>
                                        {projectData.type}
                                    </option>
                                    <option value={projectData.type}>
                                        {projectData.type}
                                    </option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Статус</span>
                                <select className="border-2 border-gray-300 p-5">
                                    <option value={projectData.status}>
                                        {projectData.status}
                                    </option>
                                    <option value={projectData.status}>
                                        {projectData.status}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="project-card__body grid grid-cols-3 gap-5">
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Оплаты</span>
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 p-5"
                                    value={projectData.payments}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">
                                    Дебиторская задолженность
                                </span>
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 p-5"
                                    value={projectData.accounts_receivable}
                                />
                            </div>
                        </div>

                        <div className="project-card__body grid grid-cols-3 gap-5">
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Сфера</span>
                                <select className="border-2 border-gray-300 p-5">
                                    <option value={projectData.sector}>
                                        {projectData.sector}
                                    </option>
                                    <option value={projectData.sector}>
                                        {projectData.sector}
                                    </option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Услуги</span>
                                <select className="border-2 border-gray-300 p-5">
                                    <option value={projectData.services}>
                                        {projectData.services}
                                    </option>
                                    <option value={projectData.services}>
                                        {projectData.services}
                                    </option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <span className="text-gray-400">Заказчик</span>
                                <select className="border-2 border-gray-300 p-5">
                                    <option value={projectData.client}>
                                        {projectData.client}
                                    </option>
                                    <option value={projectData.client}>
                                        {projectData.client}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <span className="text-gray-400">
                                Кредитные управляющие
                            </span>
                            <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg text-sm">
                                <thead>
                                    <tr className="bg-blue-300 text-white">
                                        <th className="border border-gray-300 px-4 py-2 align-middle">
                                            Название банка
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 align-middle">
                                            ФИО менеджера
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                                        <td
                                            className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                            style={{
                                                verticalAlign: "stretch",
                                            }}
                                        >
                                            {Array.isArray(
                                                projectData.credit_manager_bank_name
                                            ) ? (
                                                <table className="w-full">
                                                    <tbody>
                                                        {projectData.credit_manager_bank_name.map(
                                                            (item, index) => (
                                                                <tr
                                                                    className="border-b border-gray-300 transition"
                                                                    key={`${projectData.credit_manager_bank_name.key}_${index}`}
                                                                >
                                                                    <td>
                                                                        <select className="w-full p-2">
                                                                            <option
                                                                                value={item.toString()}
                                                                            >
                                                                                {item.toString()}
                                                                            </option>
                                                                            <option
                                                                                value={item.toString()}
                                                                            >
                                                                                {item.toString()}
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <select className="w-full p-2">
                                                    <option
                                                        value={projectData.credit_manager_bank_name.toString()}
                                                    >
                                                        {projectData.credit_manager_bank_name.toString()}
                                                    </option>
                                                    <option
                                                        value={projectData.credit_manager_bank_name.toString()}
                                                    >
                                                        {projectData.credit_manager_bank_name.toString()}
                                                    </option>
                                                </select>
                                            )}
                                        </td>

                                        <td
                                            className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                            style={{
                                                verticalAlign: "stretch",
                                            }}
                                        >
                                            {Array.isArray(
                                                projectData.credit_manager_name
                                            ) ? (
                                                <table className="w-full">
                                                    <tbody>
                                                        {projectData.credit_manager_name.map(
                                                            (item, index) => (
                                                                <tr
                                                                    className="border-b border-gray-300 transition"
                                                                    key={`${projectData.credit_manager_name.key}_${index}`}
                                                                >
                                                                    <td>
                                                                        <select className="w-full p-2">
                                                                            <option
                                                                                value={item.toString()}
                                                                            >
                                                                                {item.toString()}
                                                                            </option>
                                                                            <option
                                                                                value={item.toString()}
                                                                            >
                                                                                {item.toString()}
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <select className="w-full p-2">
                                                    <option
                                                        value={projectData.credit_manager_name.toString()}
                                                    >
                                                        {projectData.credit_manager_name.toString()}
                                                    </option>
                                                    <option
                                                        value={projectData.credit_manager_name.toString()}
                                                    >
                                                        {projectData.credit_manager_name.toString()}
                                                    </option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p>Нет данных</p>
                )}
            </div>
        </main>
    );
};

export default ProjectCard;
