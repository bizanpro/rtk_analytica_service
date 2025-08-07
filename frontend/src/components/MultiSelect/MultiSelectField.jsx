import { useState } from "react";

import MultiSelectWithSearch from "./MultiSelectWithSearch";
import OverlayTransparent from "../Overlay/OverlayTransparent";

const MultiSelectField = ({ placeholder, target, options, fieldName }) => {
    const [isActiveSelect, setIsActiveSelect] = useState("");

    return (
        <>
            {isActiveSelect === target && (
                <OverlayTransparent
                    state={true}
                    toggleMenu={() => setIsActiveSelect("")}
                />
            )}

            <div
                className="form-multiselect-field"
                onClick={() => setIsActiveSelect(target)}
            >
                {placeholder}

                {isActiveSelect === target && (
                    <MultiSelectWithSearch
                        options={options}
                        // selectedValues={filters[filter]}
                        // onChange={(updated) =>
                        //     setFilters((prev) => ({
                        //         ...prev,
                        //         ...updated,
                        //     }))
                        // }
                        fieldName={fieldName}
                        // close={setOpenFilter}
                    />
                )}
            </div>
        </>
    );
};

export default MultiSelectField;
