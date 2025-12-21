import useDebouncedFunction from "./useDebouncedFunction";

export const createDebounce = (callback, delay, immediate) => {
    return useDebouncedFunction(
        (event) => {
            callback(event);
        },
        delay,
        immediate
    );
};
