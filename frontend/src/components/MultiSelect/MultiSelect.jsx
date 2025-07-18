const MultiSelect = ({ options, selectedValues = [], onChange, fieldName }) => {
    const toggleValue = (value) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        onChange({ [fieldName]: newValues });
    };

    return (
        <ul>
            {options.map((option) => (
                <li key={option.value}>
                    <label
                        className="px-1 py-2 flex items-start gap-2 cursor-pointer"
                        htmlFor={`${option.label}_${option.value}`}
                    >
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={selectedValues.includes(option.value)}
                            onChange={() => toggleValue(option.value)}
                            id={`${option.label}_${option.value}`}
                        />

                        <div className="leading-5">{option.label}</div>
                    </label>
                </li>
            ))}
        </ul>
    );
};

export default MultiSelect;
