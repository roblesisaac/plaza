import { handleError } from 'vue';
import boxes from '../models/boxes';
import products from '../models/products';
import listings from '../models/listings';

const models = {
    boxes,
    products,
    listings
};

export function saveNewItem(collection, item, user={}) {
    try {
        const model = models[collection];
        return model.save({ ...item, userid: user._id });
    } catch (err) {
        handleError(err);
    }
}

export function updateItem(collection, updatedItem) {
    try {
        const model = models[collection];
        return model.update(updatedItem._id, updatedItem);
    } catch (err) {
        handleError(err);
    }
}

export function deleteItem(collection, _id) {
    try {
        const model = models[collection];
        return model.erase(_id);
    } catch (err) {
        handleError(err);
    }
}

export async function findAllItems(collection, filters) {
    try {
        const model = models[collection];
        const items = await model.findAll(filters);
        
        return items;
    } catch (err) {
        handleError(err);
    }
}

export function findOne(collection, _id) {
    try {
        const model = models[collection];
        return model.findOne(_id);
    } catch (err) {
        handleError(err);
    }
}