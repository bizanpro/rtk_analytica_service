import { useState } from "react";

import Indicators from "./Dashboards/Indicators/Indicators";
import Finance from "./Dashboards/Finance/Finance";
import Projects from "./Dashboards/Projects/Projects";
import Sales from "./Dashboards/Sales/Sales";
import Staff from "./Dashboards/Staff/Staff";

const Home = () => {
    const TABS = [
        {
            label: "Ключевые показатели",
            key: "indicators",
        },
        { label: "Финансы", key: "finance" },
        { label: "Проекты", key: "projects" },
        { label: "Продажи", key: "sales" },
        { label: "Персонал", key: "staff" },
    ];

    const TAB_CONTENT = {
        indicators: <Indicators />,
        finance: <Finance />,
        projects: <Projects />,
        sales: <Sales />,
        staff: <Staff />,
    };

    const [activeTab, setActiveTab] = useState("indicators");

    return (
        <main className="page">
            <div className="container pt-8 min-h-screen flex flex-col">
                <div className="flex flex-col justify-between gap-6 mb-8">
                    <nav className="flex items-center gap-10 border-b border-gray-300 text-lg">
                        {TABS.map((tab) => (
                            <button
                                type="button"
                                className={`py-2 transition-all border-b-2 ${
                                    activeTab == tab.key
                                        ? "border-gray-500"
                                        : "border-transparent"
                                }`}
                                onClick={() => setActiveTab(tab.key)}
                                title={`Перейти на вкладку ${tab.label}`}
                                key={tab.key}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="w-full pb-5 relative min-h-full flex-grow overflow-y-auto">
                    {TAB_CONTENT[activeTab] || null}
                </div>
            </div>
        </main>
    );
};

export default Home;
