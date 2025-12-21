import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({
    isLoading,
    meta,
    setPage,
    isFiltering,
}) => {
    const ref = useRef(null);

    useEffect(() => {
        if (isFiltering || !ref.current || isLoading || !meta) return;

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
    }, [isLoading, meta, isFiltering]);

    useEffect(() => {
        if (
            isFiltering ||
            !meta ||
            isLoading ||
            meta.current_page >= meta.last_page
        )
            return;

        const hasScroll =
            document.documentElement.scrollHeight >
            document.documentElement.clientHeight;

        if (!hasScroll) {
            const timeout = setTimeout(() => {
                setPage((prev) => prev + 1);
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [meta, isLoading, isFiltering]);

    return ref;
};
