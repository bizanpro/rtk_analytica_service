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
            <button type="button" className="user__info cursor-pointer font-medium text-lg" onClick={toggleMenu}>
                Пользователь
            </button>

            <nav
                className={`user__nav absolute flex flex-col gap-[15px] pt-5 pb-6 pl-4 pr-4 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm ${
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
