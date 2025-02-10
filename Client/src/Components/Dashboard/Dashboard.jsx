import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';
import CreateQuotation from './CreateQuotation/CreateQuotation';
import FGComponents from './FGComponents/FGComponents';
import ViewQuotation from './ViewQuotation/ViewQuotation';
import ProductCodeGenerator from './ProductCodeGenerator/ProductCodeGenerator';
import EditComponents from './Edit_Values/EditComponents';

const Dashboard = () => {
    const [activeContent, setActiveContent] = useState(() => {
        return localStorage.getItem('activeContent') || 'main-content';
    });
    const [quotationRef, setQuotationRef] = useState(() => {
        return localStorage.getItem('quotationRef') || ""; // Initialize from localStorage if available
    });

    // Update localStorage whenever the quotationRef state changes
    useEffect(() => {
        if (quotationRef) {
            localStorage.setItem("quotationRef", quotationRef);
        }
    }, [quotationRef]); // Only update localStorage when quotationRef changes

    const handleSidebarClick = (content) => {
        if (content === "main-content" || content === "create-quotation" || content === "view-quotation" || content === "fg-components" || content === "product-code-generator" || content === "edit-component") {
            setActiveContent(content);
            localStorage.setItem('activeContent', content);
        }
    };

    useEffect(() => {
        const savedContent = localStorage.getItem('activeContent');
        if (savedContent) {
            setActiveContent(savedContent);
        }
    }, []);

    return (
        <div className="d-flex flex-column flex-lg-row" style={{ height: '100vh' }}>
            {/* Sidebar */}
            <div className="sidebar text-white d-none d-lg-block" style={{ minWidth: '250px', maxWidth: '300px' }}>
                <Sidebar onClick={handleSidebarClick} />
            </div>

            {/* Content Area */}
            <div className="dashboard-content flex-grow-1 p-3 p-lg-4">
                {/* Show the active content */}
                {activeContent === 'main-content' && <MainContent />}
                {activeContent === 'create-quotation' && <CreateQuotation onSubmit={() => handleSidebarClick('product-code-generator')} setQuotationRef={setQuotationRef} />}
                {activeContent === 'view-quotation' && <ViewQuotation onSubmit={() => handleSidebarClick('edit-component')} />}
                {activeContent === 'fg-components' && <FGComponents />}
                {activeContent === 'product-code-generator' && <ProductCodeGenerator quotationRef={quotationRef} />}
                {activeContent === 'edit-component' && <EditComponents />}
            </div>
        </div>
    );
};

export default Dashboard;
