import "./Overlay.scss";

const Overlay = ({
    state,
    toggleMenu,
}: {
    state: boolean;
    toggleMenu: () => void;
}) => {
    return (
        <div
            className={`overlay ${state ? "active" : ""}`}
            onClick={() => {
                if (state) {
                    toggleMenu();
                }
            }}
        ></div>
    );
};

export default Overlay;
