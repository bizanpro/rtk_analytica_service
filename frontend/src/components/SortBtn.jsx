import { useState, useEffect } from "react";

const SortBtn = ({ label, value, sortBy, setSortBy, className }) => {
    const [state, setState] = useState({
        class: "",
        title: "Сортировать по убыванию",
    });

    const handleState = () => {
        switch (state.class) {
            case "":
                setState({
                    class: "sort-btn_ascending",
                    title: "Сортировать по возрастанию",
                });
                setSortBy({ key: value, action: "ascending" });

                break;

            case "sort-btn_ascending":
                setState({
                    class: "sort-btn_descending",
                    title: "Отменить сортировку",
                });
                setSortBy({ key: value, action: "descending" });

                break;

            case "sort-btn_descending":
                setState({
                    class: "",
                    title: "Сортировать по убыванию",
                });
                setSortBy({ key: "", action: "" });

                break;
        }
    };

    useEffect(() => {
        if (value !== sortBy.key) {
            setState({
                class: "",
                title: "Сортировать по убыванию",
            });
        }
    }, [sortBy]);

    return (
        <button
            type="button"
            className={`sort-btn ${className} ${state.class} `}
            onClick={() => handleState()}
            title={state.title}
        >
            {label}

            <span></span>
        </button>
    );
};

export default SortBtn;
