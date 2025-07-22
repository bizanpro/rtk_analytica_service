import { NavLink } from "react-router-dom";

import "./User.scss";

const User = () => {
    return (
        <NavLink to={"/"} className="user">
            <div className="user__photo">ИИ</div>

            <div className="user__info">
                <b>Иванов Иван Иванович</b>
                <span>ivan@yandex.ru</span>
            </div>
        </NavLink>
    );
};

export default User;
