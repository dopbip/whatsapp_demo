'use strict';
const request = require('request');
//const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports = class EcommerceStore {
    constructor() {}
    async _fetchAssistant(endpoint) {
        return new Promise((resolve, reject) => {
            request.get(
                `https://panty-shop-api-7e8bd79edf87.herokuapp.com${endpoint ? endpoint : '/'}`,
                (error, res, body) => {
                    try {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({
                                status: 'success',
                                data: JSON.parse(body),
                            });
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    async _postAssistant(endpoint, requestBody) { 
        return new Promise((resolve, reject) => {
            const options = {
                url: `https://panty-shop-api-7e8bd79edf87.herokuapp.com${endpoint ? endpoint : '/'}`,
                method: 'POST',
                json: true,
                body: requestBody,
            };
    
            request(options, (error, res, body) => {
                try {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            status: 'success',
                            data: body,
                        });
                    }
                } catch (error) {
                    reject(error);
                }
            });
        })       
    }
    async getProductById(productId) {
        return await this._fetchAssistant(`/items/${productId}`);
    }
    async getAllCategories() {
        return await this._fetchAssistant('/items/categories?limit=100');
    }
    async getItemsInCategory(categoryId) {
        return await this._fetchAssistant(
            `/api/items/category?name=${categoryId}`
        );
    }

    generatePDFInvoice({ order_details, file_path }) {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(file_path));
        doc.fontSize(25);
        doc.text(order_details, 100, 100);
        doc.end();
        return;
    }
};
