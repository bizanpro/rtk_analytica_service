import User from "../User/User";
import HeaderNav from "../HeaderNav/HeaderNav";

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
                        role="link"
                    >
                        <img src={logo} alt="Логотип РТК" />
                    </a>

                    <HeaderNav />

                    <User />
                </div>
            </div>
        </header>
    );
};

export default Header;
