import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./Home";
import NotFound from "./NotFound";
import Header from "./Header/Header";
import Projects from "./Projects/Projects";
import ProjectCard from "./ProjectCard/ProjectCard";
import Employees from "./Employees/Employees";
import EmployeeCard from "./Employees/EmployeeCard";
import ReferenceBooks from "./ReferenceBooks/ReferenceBooks";
import SingleBook from "./ReferenceBooks/SingleBook";
import Customers from "./Customers/Customers";
import CustomerCard from "./CustomerCard/CustomerCard";
import Suppliers from "./Suppliers/Suppliers";
import SupplierCard from "./SupplierCard/SupplierCard";
import Reports from "./Reports/Reports";
import Sales from "./Sales/Sales";
import SaleCard from "./SaleCard/SaleCard";

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

                    <Route path="contragents" element={<Customers />} />
                    <Route
                        path="contragents/:contragentId"
                        element={<CustomerCard />}
                    />

                    <Route path="reports" element={<Reports />} />

                    <Route path="employees" element={<Employees />} />
                    <Route
                        path="employees/:employeeId"
                        element={<EmployeeCard />}
                    />

                    <Route path="suppliers" element={<Suppliers />} />
                    <Route
                        path="suppliers/:supplierId"
                        element={<SupplierCard />}
                    />

                    <Route
                        path="reference-books"
                        element={<ReferenceBooks />}
                    />
                    <Route
                        path="reference-books/:bookId"
                        element={<SingleBook />}
                    />

                    <Route path="sales" element={<Sales />} />
                    <Route path="sales/:saleId" element={<SaleCard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
