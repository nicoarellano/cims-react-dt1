import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const Rheader = () => {
    return (
        <>
            <header className="p-1 bg-dark text-white">
                <nav className="site-header sticky-top py-1">
                    <div className="container d-flex flex-column flex-md-row justify-content-between">
                        
                            <a href="https://www.cimslab.com/" target="_blank" rel="noreferrer"> 
                                <img src="cims-logo-black.png" alt="logo" height="45px" width="200px" />
                            </a>
                      
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Rheader;
