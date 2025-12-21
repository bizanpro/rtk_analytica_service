import "./Overlay.scss";

const OverlayTransparent = ({
    state,
    toggleMenu,
}: {
    state: boolean;
    toggleMenu: () => void;
}) => {
    return (
        <div
            className={`overlay overlay-transparent ${state ? "active" : ""}`}
            onClick={() => {
                if (state) {
                    toggleMenu();
                }
            }}
        ></div>
    );
};

export default OverlayTransparent;
