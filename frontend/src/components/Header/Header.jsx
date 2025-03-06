import { NavLink } from "react-router-dom";

import User from "../User/User";

import "./Header.scss";

import logo from "../../assets/logo.png";

const Header = () => {
    return (
        <header className="header border-b border-gray-200 py-6">
            <div className="container header__container">
                <div className="header__wrapper">
                    <a
                        href="/"
                        className="image header__logo font-semibold text-2xl"
                        aria-label="Перейти на главную страницу"
                    >
                        <img src={logo} alt="Логотип РТК" />
                    </a>

                    <nav className="flex items-center gap-10 flex-grow text-xl">
                        <NavLink
                            to={"/"}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__list-item font-medium"
                                    : "sidebar__list-item"
                            }
                            title="Показатели компании"
                        >
                            Главная
                        </NavLink>

                        <NavLink
                            to={"/projects"}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__list-item font-medium"
                                    : "sidebar__list-item"
                            }
                            title="Справочник проектов"
                        >
                            Проекты
                        </NavLink>

                        <NavLink
                            to={"/reports"}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__list-item font-medium"
                                    : "sidebar__list-item"
                            }
                            title="Справочник проектов"
                        >
                            Отчеты
                        </NavLink>

                        <NavLink
                            to={"/employees"}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__list-item font-medium"
                                    : "sidebar__list-item"
                            }
                            title="Справочник сотрудников"
                        >
                            Сотрудники
                        </NavLink>

                        <NavLink
                            to={"/contractors"}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__list-item font-medium"
                                    : "sidebar__list-item"
                            }
                            title="Справочник сотрудников"
                        >
                            Подрядчики
                        </NavLink>
                    </nav>

                    <User />
                </div>
            </div>
        </header>
    );
};

export default Header;
