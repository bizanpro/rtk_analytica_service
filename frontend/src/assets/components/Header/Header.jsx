import User from "../User/User";

const Header = () => {
    return (
        <header className="header border-b border-gray-200 py-6">
            <div className="container header__container flex justify-between items-center">
                <div className="header__logo font-semibold text-2xl">РТК</div>

                <User />
            </div>
        </header>
    );
};

export default Header;
