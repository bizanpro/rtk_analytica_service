import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../MainLayout";
import Home from "../Home";
import NotFound from "../NotFound";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
import Projects from "../Projects/Projects";
import ProjectCard from "../Projects/ProjectCard";
import Employees from "../Employees/Employees";
import EmployeeCard from "../Employees/EmployeeCard";

import "./App.scss";

function App() {
    return (
        <BrowserRouter basename="/">
            <Sidebar />

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

                    <Route path="employees" element={<Employees />} />
                    <Route
                        path="employees/:employeeId"
                        element={<EmployeeCard />}
                    />
                </Route>
            </Routes>

            {/* <Footer /> */}
        </BrowserRouter>
    );
}

export default App;
