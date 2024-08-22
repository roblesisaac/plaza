import * as dbServices from '../services/dbServices';

import { sendError } from '../utils/errors';

export default {
    async findAll(req, res) {
        try {
            const items = await dbServices.findAllItems(req.params.collection, req.query);
    
            res.json(items);
        } catch (err) {
            sendError(res, err);
        }
    },

    async findOne(req, res) {
        try {
            const item = await dbServices.findOne(req.params.collection, req.params.id);
    
            res.json(item);
        } catch (err) {
            sendError(res, err);
        }
    },

    async saveNewItem(req, res) {
        try {
            const { params, body, user } = req;
            const item = await dbServices.saveNewItem(params.collection, body, user);
    
            res.json(item);
        } catch (err) {
            sendError(res, err);
        }
    },

    async updateItem(req, res) {
        try {
            const item = await dbServices.updateItem(req.params.collection, req.body);
    
            res.json(item);
        } catch (err) {
            sendError(res, err);
        }
    },

    async deleteItem(req, res) {
        try {
            const item = await dbServices.deleteItem(req.params.collection, req.params.id);
    
            res.json(item);
        } catch (err) {
            sendError(res, err);
        }
    }


}