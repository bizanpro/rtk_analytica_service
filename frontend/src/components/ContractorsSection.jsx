import { useState } from "react";

const ContractorsSection = ({
    index,
    handleContractorChange,
    suppliers,
    roles,
    getData,
}) => {
    const [localContracts, setLocalContracts] = useState([]);

    // Получение договоров подрядчика
    const fetchContracts = (id) => {
        getData(
            `${import.meta.env.VITE_API_URL}contragents/${id}/contracts`
        ).then((response) => {
            setLocalContracts(response.data);
        });
    };

    // Обработчик изменения контрагента
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

    return (
        <div className="flex flex-col gap-1">
            <div className="grid gap-3 grid-cols-2">
                <div className="flex flex-col gap-2 justify-between">
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            onChange={handleContragentChange}
                        >
                            <option value="0">Выберите контрагента</option>
                            {suppliers?.map((supplier) => (
                                <option value={supplier.id} key={supplier.id}>
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
                                <option value={contract.id} key={contract.id}>
                                    {contract.contract_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractorsSection;
