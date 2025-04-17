import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({ isLoading, meta, setPage }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || isLoading || !meta) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    meta.current_page < meta.last_page
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [isLoading, meta]);

    useEffect(() => {
        if (!meta || isLoading || meta.current_page >= meta.last_page) return;

        const hasScroll =
            document.documentElement.scrollHeight >
            document.documentElement.clientHeight;

        if (!hasScroll) {
            const timeout = setTimeout(() => {
                setPage((prev) => prev + 1);
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [meta, isLoading]);

    return ref;
};
