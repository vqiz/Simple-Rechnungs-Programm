import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../styles/swiss.css';

const Layout = ({ children }) => {
    return (
        <div className="swiss-container">
            <Sidebar />
            <main className="swiss-main">
                {children}
            </main>
        </div>
    );
};

export default Layout;
