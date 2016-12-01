import React, { PropTypes } from 'react';
import ProductRow from './ProductRow';

const products = [
    {
        name: 'Les Images',
        short: 'Piano Solo, difficulty: medium',
        history: '',
        price: 1.99,
        tags: ['Solo', 'Piano', 'Sheet Music', 'Audio', 'Medium']
    },
    {
        name: "Angels' Lullaby",
        short: 'Piano Solo, medium difficulty',
        history: '',
        price: 1.49,
        tags: ['Choir', 'Sheet Music', 'Audio', 'Medium', 'Christmas', 'SATB']
    }
];

const ProductTable = ({ filter }) => {
    let rows = [];

    products.forEach((p) => {
        const nameLC = p.name.toLowerCase();
        const filterLC = filter.toLowerCase();

        if (nameLC.indexOf(filterLC) !== -1) {
            rows.push(
                <ProductRow key={p.name} data={p} />
            );
        }
    });

    return <div> {rows} </div>;
};

ProductTable.propTypes = {
    filter: PropTypes.string
};

export default ProductTable;
