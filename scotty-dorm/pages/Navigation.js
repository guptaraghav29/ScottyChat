import React from "react";
import Link from 'next/link'

function Navigation(props) {
    return (
        <div className="navigation">
            <nav class="navbar navbar-expand navbar-light">
                <div class="container">
                    <div id="leftBar">
                        <Link href="/">
                            <a> <b> ScottyDorm </b> </a>
                        </Link>
                    </div>
                    <div>
                        <ul class="navbar-nav ml-auto">
                            <li>
                                <Link href="/Login">
                                    <a> Login </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/Dorms">
                                    <a> Dorms </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/About">
                                    <a> About </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default (Navigation);