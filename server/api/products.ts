import fs from 'fs';

var PRODUCT_CACHE: any = null;

export default defineEventHandler((event) => {
    if (PRODUCT_CACHE === null) {
        PRODUCT_CACHE = loadProducts()
    }

    return PRODUCT_CACHE;
})


function loadProducts() {
    console.log('Loading products')
    let rawdata = fs.readFileSync('./static/products.json', 'utf8');
    let products = JSON.parse(rawdata);
    console.log('Products loaded')
    return products
}