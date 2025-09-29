import "./BottomNav.scss";

const BottomNavCard = ({ children, update }) => {
    return (
        <nav className="bottom-nav">
            <div className="container bottom-nav__container">
                <button
                    type="button"
                    className="cancel-button"
                    // onClick={() => updateProject(cardId)}
                    disabled
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.93938 6.71811L9.93938 1.71811L11.3536 3.13233L7.0607 7.42522L11.3536 11.7181L9.93938 13.1323L4.93938 8.13233C4.54885 7.7418 4.54885 7.10864 4.93938 6.71811Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>

                <button
                    type="button"
                    className="action-button"
                    title="Сохранить изменения"
                    onClick={update}
                >
                    Сохранить
                </button>

                {children}
            </div>
        </nav>
    );
};

export default BottomNavCard;
