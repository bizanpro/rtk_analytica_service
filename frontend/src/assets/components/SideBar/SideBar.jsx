import { NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import "./Sidebar.scss";

const Sidebar = () => {
    return (
        <nav className="sidebar fixed top-0 bottom-0 left-0 z-50 w-max h-screen bg-white border-r border-gray-200">
            <div className="sidebar__wrapper h-full px-3 pb-4 pt-[70px] overflow-y-auto bg-white">
                <div className="sidebar__header"></div>

                <div className="sidebar__body space-y-2 font-medium">
                    <NavLink
                        to={"/"}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar__list-item flex items-center p-2 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                                : "sidebar__list-item flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group text-lg"
                        }
                        title="Показатели компании"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Показатели компании"
                        data-tooltip-place="right"
                    >
                        Показатели компании
                        <Tooltip id="tooltip-main" />
                    </NavLink>

                    <NavLink
                        to={"/projects"}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar__list-item flex items-center p-2 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                                : "sidebar__list-item flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group text-lg"
                        }
                        title="Справочник проектов"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Справочник проектов"
                        data-tooltip-place="right"
                    >
                        Справочник проектов
                        <Tooltip id="tooltip-main" />
                    </NavLink>

                    <NavLink
                        to={"/employees"}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar__list-item flex items-center p-2 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                                : "sidebar__list-item flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group text-lg"
                        }
                        title="Справочник сотрудников"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Справочник сотрудников"
                        data-tooltip-place="right"
                    >
                        Справочник сотрудников
                        <Tooltip id="tooltip-main" />
                    </NavLink>
                </div>

                <div className="sidebar__footer"></div>
            </div>
        </nav>
    );
};

export default Sidebar;
