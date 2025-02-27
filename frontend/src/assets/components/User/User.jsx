import { NavLink } from "react-router-dom";
import { useState } from "react";

import "./User.scss";

const User = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        const currentState = isActive;
        setIsActive(!currentState);
    };

    return (
        <div className="user">
            <button type="button" className="user__info cursor-pointer font-medium text-lg flex items-center gap-2" onClick={toggleMenu}>
                Пользователь

                <span className="flex items-center justify-center w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fillRule="non-zero" d="M13.069 5.157L8.384 9.768a.546.546 0 01-.768 0L2.93 5.158a.552.552 0 00-.771 0 .53.53 0 000 .759l4.684 4.61a1.65 1.65 0 002.312 0l4.684-4.61a.53.53 0 000-.76.552.552 0 00-.771 0"/></svg>
                </span>
            </button>

            <nav
                className={`user__nav w-[120px] absolute flex flex-col gap-[15px] pt-3 pb-4 pl-4 pr-4 z-50 my-2 text-base list-none bg-white rounded-sm shadow-sm ${
                    isActive ? "active" : ""
                }`}
            >
                <NavLink to="/profile" aria-label="Перейти в профиль">
                    Профиль
                </NavLink>
                <NavLink to="/logout" aria-label="Выйти из профиля">
                    Выйти
                </NavLink>
            </nav>
        </div>
    );
};

export default User;
