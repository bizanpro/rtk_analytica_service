import { useEffect } from "react";

export const useInfiniteScroll = ({ isLoading, hasMore, loadMore }) => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            const isNearBottom = scrollTop + windowHeight >= docHeight - 100;

            if (isNearBottom && !isLoading && hasMore) {
                loadMore();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, hasMore, loadMore]);
};
