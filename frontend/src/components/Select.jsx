const Select = ({ title, items, className, onChange, value }) => {
    return (
        <select
            className={className}
            onChange={onChange}
            {...(value !== undefined ? { value } : {})}
        >
            <option value="default">{title}</option>
            {items.map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default Select;
