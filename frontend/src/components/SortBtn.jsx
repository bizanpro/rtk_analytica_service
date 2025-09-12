import { useState, useEffect } from "react";

const SortBtn = ({
    label,
    value,
    sortBy,
    setSortBy,
    className = "",
    initialSort = null,
}) => {
    const getInitialState = () => {
        if (initialSort?.key === value) {
            switch (initialSort.action) {
                case "ascending":
                    return {
                        class: "sort-btn_ascending",
                        title: "Сортировать по возрастанию",
                    };
                case "descending":
                    return {
                        class: "sort-btn_descending",
                        title: "Отменить сортировку",
                    };
            }
        }
        return { class: "", title: "Сортировать по убыванию" };
    };

    const [state, setState] = useState(getInitialState);

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
            setState({ class: "", title: "Сортировать по убыванию" });
        }
    }, [sortBy, value]);

    useEffect(() => {
        if (
            initialSort?.key === value &&
            (sortBy.key !== initialSort.key ||
                sortBy.action !== initialSort.action)
        ) {
            setSortBy(initialSort);
        }
    }, [initialSort, value, sortBy, setSortBy]);

    return (
        <button
            type="button"
            className={`sort-btn ${className} ${state.class}`}
            onClick={() => handleState()}
            title={state.title}
        >
            {label}

            <span></span>
        </button>
    );
};

export default SortBtn;
