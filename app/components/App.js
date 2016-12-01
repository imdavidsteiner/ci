import React, { PropTypes } from 'react';
import Nav from './Nav';
const App = ({ children }) =>
    <div>
        <header>
            <img src="/resources/image/IMGP9049-banner_mini.jpg"/>
            <h1>Crescendo Imprints</h1>
            <Nav/>
        </header>
        { children }
        <footer>
            <Nav/>
        </footer>
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;
