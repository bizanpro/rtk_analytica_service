const FilledExecutorBlock = ({ contanct }) => {
    // const { full_name, phone, position, email } = contanct;

    return (
        <li className="flex items-center justify-between gap-6 w-full">
            <div className="executor-block flex-grow">
                <div className="grid grid-cols-[60%_1fr] p-1">
                    <div className="text-xl">
                        {/* {full_name} */}
                        Прохоров Серей Викторович
                    </div>
                    <div className="text-xl">
                        {/* {phone} */}
                        +7 952 452 12 45
                    </div>
                </div>
                <div className="grid grid-cols-[60%_1fr] p-1">
                    <div>
                        {/* {position} */}
                        Руководитель капитального строительства
                    </div>
                    <div>
                        {/* {email} */}
                        prohorov@sgrk.ru
                    </div>
                </div>
            </div>
        </li>
    );
};

export default FilledExecutorBlock;
