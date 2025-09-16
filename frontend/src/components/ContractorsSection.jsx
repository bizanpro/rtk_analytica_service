import { useEffect, useState } from "react";
import getData from "../utils/getData";

import CreatableSelect from "react-select/creatable";

const ContractorsSection = ({
    index,
    handleContractorChange,
    suppliers,
    roles,
    person,
    removeContractor,
    mode,
}) => {
    const [localContracts, setLocalContracts] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    let name;

    if (mode == "read") {
        name =
            suppliers.length > 0 &&
            suppliers.find((item) => item.id === person?.contragent_id)
                .program_name;
    }

    const fetchContracts = (id) => {
        getData(
            `${import.meta.env.VITE_API_URL}contragents/${id}/contracts`
        ).then((response) => {
            setLocalContracts(response.data);
        });
    };

    const handleContragentChange = async (value) => {
        const contragentId = value;

        handleContractorChange(index, "contragent_id", contragentId);

        if (contragentId > 0) {
            try {
                fetchContracts(contragentId);
            } catch {
                setLocalContracts([]);
            }
        } else {
            setLocalContracts([]);
        }
    };

    useEffect(() => {
        if (!isMounted && person?.contragent_id) {
            fetchContracts(person.contragent_id);
            setIsMounted(true);
        }
    }, [person?.contragent_id, isMounted]);

    return (
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 flex-grow">
                <div className="grid gap-3 grid-cols-2">
                    <div className="flex flex-col gap-2 justify-between">
                        <div
                            className={`border-2 border-gray-300 flex items-center ${
                                mode == "read" ? "h-[32px] p-1" : ""
                            }`}
                        >
                            {mode === "read" ? (
                                <span
                                    className="whitespace-nowrap w-full truncate"
                                    title={name}
                                >
                                    {name}
                                </span>
                            ) : (
                                <CreatableSelect
                                    isClearable
                                    options={
                                        suppliers.length > 0 &&
                                        suppliers.map((item) => ({
                                            value: item.id,
                                            label: item.program_name,
                                        }))
                                    }
                                    className="w-full executor-block__name-field"
                                    placeholder="Выбрать исполнителя"
                                    noOptionsMessage={() => "Совпадений нет"}
                                    isValidNewOption={() => false}
                                    defaultValue={
                                        (suppliers.length > 0 &&
                                            suppliers
                                                .map((item) => ({
                                                    value: item.id,
                                                    label: item.program_name,
                                                }))
                                                .find(
                                                    (option) =>
                                                        option.value ===
                                                        person?.contragent_id
                                                )) ||
                                        null
                                    }
                                    onChange={(selectedOption) => {
                                        handleContragentChange(
                                            selectedOption.value
                                        );
                                    }}
                                    isDisabled={mode == "read"}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-between">
                        <div
                            className={`border-2 border-gray-300 p-1 ${
                                mode == "read" ? "h-[32px]" : "h-[42px]"
                            }`}
                        >
                            <select
                                className="w-full h-full"
                                value={person?.role_id}
                                onChange={(e) =>
                                    handleContractorChange(
                                        index,
                                        "role_id",
                                        Number(e.target.value)
                                    )
                                }
                                disabled={mode === "read" ? true : false}
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
                        <div className="border-2 border-gray-300">
                            <CreatableSelect
                                isClearable
                                options={
                                    localContracts.length > 0 &&
                                    localContracts.map((item) => ({
                                        value: item.id,
                                        label: item.contract_name,
                                    }))
                                }
                                className="w-full executor-block__name-field"
                                placeholder="Выберите договор"
                                noOptionsMessage={() => "Совпадений нет"}
                                isValidNewOption={() => false}
                                value={
                                    localContracts
                                        ?.map((item) => ({
                                            value: item.id,
                                            label: item.contract_name,
                                        }))
                                        .find(
                                            (option) =>
                                                option.value ===
                                                person?.contract_id
                                        ) || null
                                }
                                onChange={(selectedOption) => {
                                    const newValue =
                                        selectedOption?.value || "";

                                    handleContractorChange(
                                        index,
                                        "contract_id",
                                        Number(newValue)
                                    );
                                }}
                                isDisabled={mode === "read"}
                            />

                            {/* <select
                                className="w-full h-full"
                                value={person?.contract_id}
                                onChange={(e) =>
                                    handleContractorChange(
                                        index,
                                        "contract_id",
                                        Number(e.target.value)
                                    )
                                }
                                disabled={mode === "read"}
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
                            </select> */}
                        </div>
                    </div>
                </div>
            </div>

            {mode === "edit" && (
                <button
                    className="delete-icon w-[30px] h-[32px]"
                    title="Удалить исполнителя"
                    onClick={() => removeContractor(index)}
                ></button>
            )}
        </div>
    );
};

export default ContractorsSection;
