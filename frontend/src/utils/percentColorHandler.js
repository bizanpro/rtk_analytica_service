const pepcentColorHandler = (str) => {
    const mark = str[0];
    if (mark === "+") {
        return "text-green-400";
    } else if (mark === "-") {
        return "text-red-400";
    }
};

export default pepcentColorHandler;
