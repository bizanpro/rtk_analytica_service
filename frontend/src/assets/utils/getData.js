async function getData(url = "", headers = {}) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            const error = new Error("Ошибка сервера");
            error.status = response.status;
            throw error;
        }

        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        if (error.status === undefined && error.response) {
            error.status = error.response.status;
        }
        console.error(error);
        throw error;
    }
}

export default getData;
