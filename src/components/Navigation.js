import React from 'react';

const NavBar = () => {
    return (
        <header id="nav-bar">
            <a id="nav-img-link" href="/global"><img id="nav-img" src="https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-645x645.jpg" /></a>
            <a className="nav-items" href="/global">Global stats</a>
            <a className="nav-items" href="/">Specific stats</a>
        </header>)
}

export default NavBar