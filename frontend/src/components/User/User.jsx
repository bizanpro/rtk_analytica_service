import { NavLink } from "react-router-dom";

import "./User.scss";

const User = () => {
    return (
        <NavLink to={"/"} className="user">
            <div className="user__photo">ИИ</div>

            <div className="user__info">
                <div>
                    <b>Иванов Иван Иванович</b>
                    <span>ivan@yandex.ru</span>
                </div>
               
                <div className="user__info-icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.295 5.039l-3.75-3.75-1.06 1.06 3.22 3.22-3.22 3.22 1.06 1.06 3.75-3.75a.75.75 0 000-1.06z" fill="currentcolor"/></svg>
                </div>
            </div>
        </NavLink>
    );
};

export default User;
