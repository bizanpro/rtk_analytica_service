const EmployeeItem = ({ name, position }) => {
    return (
        <li className="grid grid-cols-[55%_40%] items-center gap-10">
            <div className="text-lg">{name}</div>
            <div>{position.name}</div>
        </li>
    );
};

export default EmployeeItem;
