import { useState, useEffect } from "react";

const TheadSortButton = ({ label, value, sortBy, setSortBy }) => {
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
            {label}

            <span>
                {state.class == "" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 3v18M6 3l4 4M6 3L2 7m16 14V3m0 18l4-4m-4 4l-4-4"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 20V4m-7 7l7-7l7 7"
                        />
                    </svg>
                )}
            </span>
        </button>
    );
};

export default TheadSortButton;
