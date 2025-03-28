import { useEffect, useState } from "react";

const ContractorsSection = ({
    index,
    handleContractorChange,
    suppliers,
    roles,
    getData,
    person,
    removeContractor,
}) => {
    const [localContracts, setLocalContracts] = useState([]);

    const fetchContracts = (id) => {
        getData(
            `${import.meta.env.VITE_API_URL}contragents/${id}/contracts`
        ).then((response) => {
            setLocalContracts(response.data);
        });
    };

    const handleContragentChange = async (e) => {
        const contragentId = Number(e.target.value);
        handleContractorChange(index, "contragent_id", contragentId);

        if (contragentId > 0) {
            try {
                fetchContracts(contragentId);
            } catch (error) {
                console.error("Ошибка при загрузке договоров:", error);
                setLocalContracts([]);
            }
        } else {
            setLocalContracts([]);
        }
    };

    useEffect(() => {
        if (person?.contragent_id) {
            fetchContracts(person?.contragent_id);
        }
    }, [person?.contragent_id]);

    return (
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 flex-grow">
                <div className="grid gap-3 grid-cols-2">
                    <div className="flex flex-col gap-2 justify-between">
                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                            <select
                                className="w-full"
                                onChange={handleContragentChange}
                                value={person?.contragent_id}
                            >
                                <option value="0">Выберите контрагента</option>
                                {suppliers?.map((supplier) => (
                                    <option
                                        value={supplier.id}
                                        key={supplier.id}
                                    >
                                        {supplier.program_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-between">
                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                            <select
                                className="w-full"
                                value={person?.role_id}
                                onChange={(e) =>
                                    handleContractorChange(
                                        index,
                                        "role_id",
                                        Number(e.target.value)
                                    )
                                }
                            >
                                <option value="0">Выберите роль</option>
                                {roles?.map((role) => (
                                    <option value={role.id} key={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1">
                    <div className="flex flex-col gap-2 justify-between">
                        <span className="text-gray-400"></span>
                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                            <select
                                className="w-full"
                                value={person?.contract_id}
                                onChange={(e) =>
                                    handleContractorChange(
                                        index,
                                        "contract_id",
                                        Number(e.target.value)
                                    )
                                }
                            >
                                <option value="0">Выберите договор</option>
                                {localContracts?.map((contract) => (
                                    <option
                                        value={contract.id}
                                        key={contract.id}
                                    >
                                        {contract.contract_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="delete-icon w-[30px] h-[32px]"
                title="Удалить исполнителя"
                onClick={() => removeContractor(index)}
            ></button>
        </div>
    );
};

export default ContractorsSection;
