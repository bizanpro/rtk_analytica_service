import "./BottomSheet.scss";

const BottomSheet = ({ children, onClick, className }) => {
    return (
        <div className={`bottom-sheet ${className}`} onClick={onClick}>
            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__body">
                    <button
                        type="button"
                        className="bottom-sheet__close-btn"
                        onClick={onClick}
                        title="Закрыть активное окно"
                    >
                        <span></span>
                    </button>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
