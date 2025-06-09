const removeEmptyFields = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, value]) =>
                value !== null &&
                value !== "" &&
                !(Array.isArray(value) && value.length === 0)
        )
    );
};

export default removeEmptyFields;
