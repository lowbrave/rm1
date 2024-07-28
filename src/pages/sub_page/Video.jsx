import React from 'react'

export default function Video() {
    return (
        <div>

            <div>{/* Header Start */}
                <div className="container-fluid page-header">
                    <div className="container">
                        <div
                            className="d-flex flex-column align-items-center justify-content-center"
                            style={{ minHeight: 400 }}
                        >
                            <h3 className="display-4 text-white text-uppercase">About</h3>
                            <div className="d-inline-flex text-white">
                                <p className="m-0 text-uppercase">
                                    <a className="text-white" href="">
                                        Home
                                    </a>
                                </p>
                                <i className="fa fa-angle-double-right pt-1 px-3" />
                                <p className="m-0 text-uppercase">About</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}



        </div>
    )
}
