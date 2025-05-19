async function postData(method = "POST", url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw {
                message: responseData.message || "Unknown error",
                status: response.status,
                data: responseData,
            };
        }

        return {
            ok: true,
            ...responseData,
        };
    } catch (error) {
        console.error("Ошибка запроса: ", error);
        throw typeof error === "object"
            ? error
            : { message: error.message || "Unknown error" };
    }
}

export default postData;
