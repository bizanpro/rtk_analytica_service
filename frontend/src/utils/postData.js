async function postData(method = "POST", url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.err || "Unknown Error"}`);
        }

        const responseData = await response.json();
        return {
            ok: true,
            ...responseData,
        };
    } catch (error) {
        console.error("Ошибка запроса: ", error);
        throw error;
    }
}

export default postData;
