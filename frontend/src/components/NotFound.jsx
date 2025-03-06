const NotFound = () => {
    return (
        <main className="page grid min-h-full place-items-center">
            <div className="container">
                <div className="text-center">
                    <p className="text-base font-semibold text-indigo-600 text-5xl">
                        404
                    </p>
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                        Страница не найдена
                    </h1>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/"
                            className="block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Вернуться на главную
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
