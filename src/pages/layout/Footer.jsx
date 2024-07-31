import React from 'react';
import '../../css/material-kit.css';

export default function Footer() {
    return (
        <div>
            <footer className="site-footer">
                <div className="container">
                    <div className="inner light">
                        <div className="container">
                            <div className="row text-center">
                                <div className="col-md-8 mb-3 mb-md-0 mx-auto">
                                    <p style={{ textShadow: '0 1px 1px BLACK', fontWeight: '1000' }}>
                                        Copyright &copy; {new Date().getFullYear()} 版權所有 &mdash; All Rights Reserved by 一號房.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}