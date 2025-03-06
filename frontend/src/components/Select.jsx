const Select = ({ title, items, className, onChange }) => {
    return (
        <select className={className} onChange={onChange}>
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
