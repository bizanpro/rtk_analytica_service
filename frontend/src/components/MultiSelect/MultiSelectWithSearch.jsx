import { useState, useEffect } from "react";

import "./MultiSelect.scss";

const MultiSelectWithSearch = ({
    options,
    selectedValues = [],
    onChange,
    fieldName,
    label,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [draftSelected, setDraftSelected] = useState(selectedValues);

    // Синхронизируем драфт с внешним состоянием, если оно изменилось
    useEffect(() => {
        setDraftSelected(selectedValues);
    }, [selectedValues]);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const allValues = options.map((o) => o.value);

    const toggleValue = (value) => {
        setDraftSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleSelectAll = () => setDraftSelected(allValues);
    const handleReset = () => setDraftSelected([]);
    const handleCancel = () => setDraftSelected(selectedValues);
    const handleApply = () => {
        onChange({ [fieldName]: draftSelected });
    };

    return (
        <div className="multi-select">
            <div className="multi-select__search">
                <input
                    type="text"
                    placeholder="Найти в списке"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-search"
                />
            </div>

            <div className="multi-select__actions">
                <button type="button" onClick={handleSelectAll}>
                    Выбрать все
                </button>
                <button type="button" onClick={handleReset}>
                    Сбросить
                </button>
            </div>

            <ul className="multi-select__list">
                {filteredOptions.map((option) => (
                    <li className="multi-select__list-item" key={option.value}>
                        <label
                            className=""
                            htmlFor={`${option.label}_${option.value}`}
                        >
                            <input
                                type="checkbox"
                                checked={draftSelected.includes(option.value)}
                                onChange={() => toggleValue(option.value)}
                                id={`${option.label}_${option.value}`}
                            />

                            <span>{option.label}</span>
                        </label>
                    </li>
                ))}
            </ul>

            <div className="multi-select__footer">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                >
                    Отменить
                </button>
                <button
                    type="button"
                    className="action-button"
                    onClick={handleApply}
                >
                    Применить
                </button>
            </div>
        </div>
    );
};

export default MultiSelectWithSearch;
