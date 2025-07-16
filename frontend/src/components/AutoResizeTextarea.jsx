import { useRef, useEffect } from "react";

function AutoResizeTextarea({
    value,
    onChange,
    disabled,
    placeholder,
    className,
}) {
    const textareaRef = useRef(null);

    const resizeTextarea = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };

    useEffect(() => {
        resizeTextarea();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            className={`border-2 border-gray-300 py-3 px-5 resize-none ${
                className || ""
            }`}
            disabled={disabled}
            value={value}
            onChange={onChange}
            rows={1}
            style={{ overflow: "hidden" }}
            placeholder={placeholder}
        />
    );
}

export default AutoResizeTextarea;
