const buildQueryParams = (filters) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
        values.forEach((value) => {
            queryParams.append(key, value);
        });
    });

    return queryParams.toString();
};

export default buildQueryParams;
