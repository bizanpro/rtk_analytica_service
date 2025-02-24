import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../MainLayout";
import Home from "../Home";
import NotFound from "../NotFound";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import "./App.scss";

function App() {
    return (
        <BrowserRouter basename="/">
            <SideBar />

            <Header />

            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
