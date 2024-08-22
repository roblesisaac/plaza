import dbControllers from '../controllers/dbControllers';

export default function(api) {
    api.get('/db/:collection', dbControllers.findAll);
    api.get('/db/:collection/:id', dbControllers.findOne);
    api.post('/db/:collection', dbControllers.saveNewItem);
    api.put('/db/:collection/:id', dbControllers.updateItem);
    api.delete('/db/:collection/:id', dbControllers.deleteItem);
}