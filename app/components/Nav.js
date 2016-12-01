import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Nav = () =>
    <div>
        <p>
            <Link to="/">Home </Link>
            <Link to="/about">About </Link>
        </p>
    </div>;

Nav.propTypes = {
    children: PropTypes.object
};

export default Nav;
