const FilledExecutorBlock = ({ contanct }) => {
    const { full_name, phone, position, email } = contanct;

    return (
        <li className="flex items-center justify-between gap-6 w-full">
            <div className="executor-block flex-grow border transition-all border-transparent">
                <div className="p-1 border-r transition-all border-transparent">
                    <div className="p-1 border-r transition-all border-transparent">
                        {full_name}
                    </div>
                    <div className="p-1 pr-3">{phone}</div>
                </div>
                <div className="grid grid-cols-[60%_40%]">
                    <div className="p-1 border-r transition-all border-transparent">
                        {position}
                    </div>
                    <div className="p-1 pr-3">{email}</div>
                </div>
            </div>
        </li>
    );
};

export default FilledExecutorBlock;
