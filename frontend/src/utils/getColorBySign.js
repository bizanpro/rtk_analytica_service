const getColorBySign = (
    value,
    color1 = "text-red-400",
    color2 = "text-green-400"
) => {
    if (!value || typeof value !== "string") return "";

    if (value.startsWith("+")) return color1;
    if (value.startsWith("-")) return color2;

    return "";
};

export default getColorBySign;
