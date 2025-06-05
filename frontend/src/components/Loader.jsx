const Loader = ({ transparent }) => {
    return (
        <div className={`loader ${transparent ? "transparent" : ""}`}>
            <div className="loader__icon"></div>
        </div>
    );
};

export default Loader;
