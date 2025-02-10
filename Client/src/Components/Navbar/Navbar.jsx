import React from 'react';
import Logo from "../../assets/images/logo.jpg"

const Navbar = () => {
    return (
        <>
            {/* Navbar with Logo */}
            <nav class="navbar bg-body-tertiary">
                <div class="container">
                    <a class="navbar-brand" href="/">
                        <img src={Logo} alt="Logo" width="130" height="100" />
                    </a>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
