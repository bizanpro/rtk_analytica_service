export const sortList = (list, sortBy) => {
    const getValue = (item) => {
        const raw = item?.[sortBy.key];
        if (raw === null || raw === undefined) return NaN;
        return Number(String(raw).replace(",", "."));
    };

    switch (sortBy.action) {
        case "":
            return list;

        case "ascending":
            return [...list].sort((a, b) => {
                const valA = getValue(a);
                const valB = getValue(b);

                if (isNaN(valA)) return 1;
                if (isNaN(valB)) return -1;
                return valB - valA;
            });

        case "descending":
            return [...list].sort((a, b) => {
                const valA = getValue(a);
                const valB = getValue(b);

                if (isNaN(valA)) return 1;
                if (isNaN(valB)) return -1;
                return valA - valB;
            });

        default:
            return list;
    }
};
