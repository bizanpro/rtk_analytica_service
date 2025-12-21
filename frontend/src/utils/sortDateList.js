export const sortDateList = (list, sortBy) => {
    const parseDate = (item) => {
        const raw = item?.[sortBy.key];

        if (!raw) return null;

        const [day, month, year] = raw.split(".").map(Number);

        if (!day || !month || !year) return null;

        return new Date(year, month - 1, day);
    };

    switch (sortBy.action) {
        case "":
            return list;

        case "descending":
            return [...list].sort((a, b) => {
                const dateA = parseDate(a);
                const dateB = parseDate(b);

                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateA - dateB;
            });

        case "ascending":
            return [...list].sort((a, b) => {
                const dateA = parseDate(a);
                const dateB = parseDate(b);

                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateB - dateA;
            });

        default:
            return list;
    }
};
