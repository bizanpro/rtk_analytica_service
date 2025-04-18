import { NavLink } from "react-router-dom";
import User from "../User/User";
import "./Header.scss";
import logo from "../../assets/logo.png";

const Header = () => {
    const links = [
        {
            url: "/",
            title: "Показатели компании",
            label: "Главная",
        },
        {
            url: "/projects",
            title: "Перейти в реестр проектов",
            label: "Проекты",
        },
        {
            url: "/contragents",
            title: "Перейти в реестр заказчиков",
            label: "Заказчики",
        },
        {
            url: "/reports",
            title: "Перейти в реестр отчетов",
            label: "Отчеты",
        },
        {
            url: "/employees",
            title: "Перейти в реестр сотрудников",
            label: "Сотрудники",
        },
        {
            url: "/suppliers",
            title: "Перейти в реестр подрядчиков",
            label: "Подрядчики",
        },
        {
            url: "/reference-books",
            title: "Перейти в справочники",
            label: "Справочники",
        },
    ];
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
                        {links.map((link, index) => (
                            <NavLink
                                to={link.url}
                                className={({ isActive }) =>
                                    isActive
                                        ? "sidebar__list-item font-medium"
                                        : "sidebar__list-item"
                                }
                                title={link.title}
                                key={index}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <User />
                </div>
            </div>
        </header>
    );
};

export default Header;
