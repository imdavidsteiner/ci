import React, { PropTypes } from 'react';
import ProductRow from './ProductRow';

const products = [
  { tags: ['Solo','Piano','Sheet Music'], name: 'Les Images' short: 'Piano Solo, difficulty: medium', history=''},
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
