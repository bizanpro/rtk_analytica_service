import { useState } from "react";

import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";

import User from "../User/User";
import HeaderNav from "../HeaderNav/HeaderNav";
import Overlay from "../Overlay/Overlay";

import "./Header.scss";

import logo from "../../assets/logo.svg";

const Header = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive((prev) => !prev);
    };

    useBodyScrollLock(isActive);

    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__wrapper">
                    <a
                        href="/"
                        className="image header__logo font-semibold text-2xl"
                        aria-label="Перейти на главную страницу"
                        role="link"
                    >
                        <img src={logo} alt="Логотип РТК" />
                    </a>

                    <div>
                        <HeaderNav state={isActive} toggleMenu={toggleMenu} />

                        <Overlay state={isActive} toggleMenu={toggleMenu} />
                    </div>

                    <div className="header__menu-nav">
                        <User />

                        <button
                            type="button"
                            className={`header__menu-btn ${
                                isActive ? "active" : ""
                            }`}
                            title="Меню"
                            onClick={toggleMenu}
                        >
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
