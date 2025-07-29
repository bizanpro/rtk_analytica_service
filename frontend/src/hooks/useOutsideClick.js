import { useEffect } from "react";

export const useOutsideClick = (refs, callback) => {
    useEffect(() => {
        const handleClick = (event) => {
            const clickedInsideSomeRef = refs.some(
                (ref) => ref.current && ref.current.contains(event.target)
            );

            if (!clickedInsideSomeRef) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [refs, callback]);
};
