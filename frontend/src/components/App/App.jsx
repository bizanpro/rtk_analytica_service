import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../MainLayout";
import Home from "../Home";
import NotFound from "../NotFound";
import Header from "../Header/Header";
import Projects from "../Projects/Projects";
import ProjectCard from "../ProjectCard/ProjectCard";
import Employees from "../Employees/Employees";
import EmployeeCard from "../Employees/EmployeeCard";

import "./App.scss";

function App() {
    return (
        <BrowserRouter basename="/">
            <Header />

            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="*" element={<NotFound />} />

                    <Route path="projects" element={<Projects />} />
                    <Route
                        path="projects/:projectId"
                        element={<ProjectCard />}
                    />
                    <Route path="projects/new" element={<ProjectCard />} />

                    <Route path="employees" element={<Employees />} />
                    <Route
                        path="employees/:employeeId"
                        element={<EmployeeCard />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
