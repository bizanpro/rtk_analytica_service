import { NavLink } from "react-router-dom";

type NavLinkItem = {
    url: string;
    title: string;
    label: string;
};

const LINKS: NavLinkItem[] = [
    {
        url: "/",
        title: "Показатели компании",
        label: "Главная",
    },
    {
        url: "/reports",
        title: "Перейти в реестр отчетов",
        label: "Отчеты",
    },
    {
        url: "/projects",
        title: "Перейти в реестр проектов",
        label: "Проекты",
    },
    {
        url: "/sales",
        title: "Перейти в реестр продаж",
        label: "Продажи",
    },
    {
        url: "/contragents",
        title: "Перейти в реестр заказчиков",
        label: "Заказчики",
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

const HeaderNav = () => {
    return (
        <nav className="flex items-center gap-10 flex-grow text-xl">
            {LINKS.map((link) => (
                <NavLink
                    to={link.url}
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar__list-item font-medium"
                            : "sidebar__list-item"
                    }
                    title={link.title}
                    key={link.url}
                >
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
};

export default HeaderNav;
