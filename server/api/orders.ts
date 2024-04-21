import fs from 'fs';

export default defineEventHandler((event) => {
    const order = MOCK_ORDEDR()
    return [order];
})

function MOCK_ORDEDR() {
    console.log('Loading products')
    let rawdata = fs.readFileSync('./static/mock_order.json', 'utf8');
    let products = JSON.parse(rawdata);
    console.log('Products loaded')
    return products
}