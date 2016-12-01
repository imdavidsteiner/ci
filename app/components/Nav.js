import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Nav = () =>
    <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
    </div>;

Nav.propTypes = {
    children: PropTypes.object
};

export default Nav;
