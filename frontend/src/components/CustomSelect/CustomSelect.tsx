import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

type OptionType = {
    value: string;
    label: string;
};

interface CustomSelectProps {
    type: string;
    placeholder: string;
    mode: string;
    options: OptionType[];
    selectedValues: number[];
    isDisabled: boolean;
}

const CustomSelect = ({
    type,
    placeholder,
    mode,
    options,
    selectedValues,
    isDisabled,
}: CustomSelectProps) => {
    const MultiValue = () => null;

    const selectedItems = selectedValues.map((item) =>
        options.find((option) => option.value === item)
    );

    const Option = (props) => {
        return (
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                    style={{ marginRight: "8px" }}
                />
                <label>{props.label}</label>
            </components.Option>
        );
    };

    return (
        <>
            <CreatableSelect
                isClearable={false}
                isMulti
                options={options}
                className="form-select-extend"
                placeholder={placeholder}
                noOptionsMessage={() => "Совпадений нет"}
                isValidNewOption={() => false}
                // value={otherIndustries.others || null}
                onChange={(selectedOption) => {
                    console.log(selectedOption);

                    // const newValue =
                    //     selectedOption?.value || null;
                }}
                isDisabled={isDisabled}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue }}
            />

            {selectedValues.length > 0 && (
                <ul className="form-multiselect__list">
                    {selectedValues.map((item) => (
                        <li
                            className="form-multiselect__item"
                            key={item?.value}
                        >
                            <span>{item?.label}</span>

                            {mode === "edit" && (
                                <button
                                    type="button"
                                    title={`Удалить ${item?.label} из списка`}
                                    // onClick={() =>
                                    // onChange({
                                    //     [fieldName]: selectedValues.filter(
                                    //         (selectedValue) =>
                                    //             selectedValue !==
                                    //             item?.value
                                    //     ),
                                    // })
                                    // }
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.06 6l2.652 2.652-1.06 1.06L6 7.061 3.348 9.712l-1.06-1.06L4.939 6 2.288 3.348l1.06-1.06L6 4.939l2.652-2.651 1.06 1.06L7.061 6z"
                                            fill="#98A2B3"
                                        />
                                    </svg>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default CustomSelect;
