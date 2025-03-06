import "./Popup.scss";

const Popup = ({ title, children, onClick }) => {
    return (
        <div className="popup" onClick={onClick}>
            <div
                className="popup__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup__header">{title}</div>
                
                {children}
            </div>
        </div>
    );
};

export default Popup;
