import React, { useRef } from "react";
import Logo from "../../../assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";
import { FaBars, FaHome, FaFileAlt, FaEye, FaCogs, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ onClick }) => {
    const navigate = useNavigate();
    const toastRef = useRef();

    const goto = () => {
        localStorage.removeItem("activeContent");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("New QuotationRef Id");
        localStorage.removeItem("Quotation Details");
        localStorage.removeItem("quotationRef");
        const toastInstance = new bootstrap.Toast(toastRef.current);
        toastInstance.show();
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <>
            {/* Hamburger Button for Mobile */}
            <button
                className="btn btn-primary d-block d-md-none position-fixed top-0 start-0 m-3"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
            >
                <FaBars size={24} />
            </button>
            {/* Sidebar - Offcanvas for Mobile, Always Visible on Desktop */}
            <div
                className="offcanvas-md offcanvas-start bg-light shadow vh-100 border-end d-md-flex flex-column position-fixed"
                id="sidebarMenu"
                tabIndex="-1"
                style={{ width: "250px" }}
            >
                {/* Sidebar Header */}
                <div className="p-4 text-center border-bottom">
                    <img src={Logo} alt="Logo" width="130" height="100" />
                </div>

                {/* Navigation List */}
                <ul className="nav flex-column p-3">
                    <li className="nav-item mb-3">
                        <button onClick={() => onClick("main-content")} className="nav-link text-primary d-flex align-items-center fs-5">
                            <FaHome className="me-2" /> Dashboard
                        </button>
                    </li>
                    <li className="nav-item mb-3">
                        <button onClick={() => onClick("create-quotation")} className="nav-link text-primary d-flex align-items-center fs-5">
                            <FaFileAlt className="me-2" /> Create Quotation
                        </button>
                    </li>
                    <li className="nav-item mb-3">
                        <button onClick={() => onClick("view-quotation")} className="nav-link text-primary d-flex align-items-center fs-5">
                            <FaEye className="me-2" /> View Quotation
                        </button>
                    </li>
                    <li className="nav-item mb-3">
                        <button onClick={() => onClick("fg-components")} className="nav-link text-primary d-flex align-items-center fs-5">
                            <FaCogs className="me-2" /> FG Components
                        </button>
                    </li>

                    {/* Logout Button with Toast */}
                    <li className="nav-item mb-3">
                        <button onClick={goto} className="nav-link text-danger d-flex align-items-center fs-5">
                            <FaSignOutAlt className="me-2" /> Logout
                        </button>

                        {/* Toast Notification */}
                        <div className="toast-container position-fixed top-0 end-0 p-3">
                            <div ref={toastRef} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="toast-header">
                                    <strong className="me-auto">SteelStrong</strong>
                                    <small>Just Now</small>
                                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div className="toast-body">You Are Logged Out!!</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
