const MultiSelect = ({ options, selectedValues = [], onChange, fieldName }) => {
    const toggleValue = (value) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        onChange({ [fieldName]: newValues });
    };

    console.log(options);
    console.log(selectedValues);

    return (
        <ul className="grid gap-2">
            {options.map((option) => (
                <li key={option.value}>
                    <label
                        className={`pr-1 py-1 flex items-start gap-2 cursor-pointer transition-colors ${
                            selectedValues.includes(option.value)
                                ? "bg-gray-100"
                                : ""
                        }`}
                        htmlFor={`${option.label}_${option.value}`}
                    >
                        <input
                            type="checkbox"
                            className="mt-1 opacity-0"
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
