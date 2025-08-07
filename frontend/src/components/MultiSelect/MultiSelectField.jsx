import { useState } from "react";

import MultiSelectWithSearch from "./MultiSelectWithSearch";
import OverlayTransparent from "../Overlay/OverlayTransparent";

const MultiSelectField = ({
    placeholder,
    target,
    options,
    fieldName,
    selectedValues,
    onChange,
}) => {
    const [isActiveSelect, setIsActiveSelect] = useState("");

    return (
        <div className="form-multiselect">
            {isActiveSelect === target && (
                <OverlayTransparent
                    state={true}
                    toggleMenu={() => setIsActiveSelect("")}
                />
            )}

            <div
                className="form-multiselect__field"
                onClick={() => setIsActiveSelect(target)}
            >
                {placeholder}
            </div>

            {isActiveSelect === target && (
                <MultiSelectWithSearch
                    options={options}
                    selectedValues={selectedValues}
                    onChange={onChange}
                    fieldName={fieldName}
                    close={setIsActiveSelect}
                />
            )}
        </div>
    );
};

export default MultiSelectField;
