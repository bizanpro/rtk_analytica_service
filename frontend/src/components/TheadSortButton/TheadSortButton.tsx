import { useState, useEffect } from "react";

import "./TheadSortButton.scss";

const TheadSortButton = ({
    value,
    sortBy,
    setSortBy,
}: {
    value: number;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [state, setState] = useState({
        class: "",
        title: "Сортировать по убыванию",
    });

    const handleState = () => {
        switch (state.class) {
            case "":
                setState({
                    class: "thead__item-sort-btn_ascending",
                    title: "Сортировать по возрастанию",
                });
                setSortBy({ key: value, action: "ascending" });

                break;

            case "thead__item-sort-btn_ascending":
                setState({
                    class: "thead__item-sort-btn_descending",
                    title: "Отменить сортировку",
                });
                setSortBy({ key: value, action: "descending" });

                break;

            case "thead__item-sort-btn_descending":
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
            className={`thead__item-sort-btn ${state.class}`}
            onClick={() => handleState()}
            title={state.title}
        >
            <div></div>
        </button>
    );
};

export default TheadSortButton;
