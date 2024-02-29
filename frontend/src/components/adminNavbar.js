import React from 'react';
import GREETINGS_DROPDOWN from './greetings_dropdown';

let firstTime = true;

const AdminNavbar = () => {
    
    const logout = (e) => {
        try {
            localStorage.removeItem("token");
            console.log("Logged out successfully");
            window.location.href = "/";
        
        } catch (error) {
            console.error(error.message);
        }
    }

    const reload = () => {
        if (localStorage.getItem("token") == null) {
            localStorage.clear();
            console.log('Cleared local storage');
        }
    }


    return (
        <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary">
            
            <div className="container-fluid">
                <a className="navbar-brand" href="/" style={{ fontSize: '30px', fontFamily: 'Roboto Mono' }}><b>NEXUSMEDS</b></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/all-researchers">All Researchers</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/all-customers">All Customers</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/all-meds">All Products</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/statistics">Statistics</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/approve">Approve</a>
                        </li>
                    </ul>
                </div>
                <GREETINGS_DROPDOWN loggedIn={true} customer_name={"Admin"} logout={logout} />
            </div>
        </nav>
    );
}

export default AdminNavbar;
