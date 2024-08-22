import { ref, nextTick } from 'vue';
import useApi from '../composables/useApi';

import products from '../staticDb/productsDb';
import listings from '../staticDb/listingsDb';

const { get, post, put, remove } = useApi();

const staticData = {
  products,
  listings,
};

const database = ref({});
const errorList = ref([]);

export default function useDb(collectionName) {

  function getCollection() {
    if (!database.value[collectionName]) {
      database.value[collectionName] = {
        items: [],
        isLoading: false,
        lastResponse: null,
        status: null,
        isStatic: false
      }
    }

    return database.value[collectionName];
  }

  async function fetchAll() {
    const collection = getCollection();

    try {
      collection.status = `fetching all ${collectionName}`;
      collection.isLoading = true;
      
      const items = await get(`db/${collectionName}`);
      collection.items =  items || [];
      return collection.items;
    } catch (error) {
      if(hasStaticData()) {
        collection.items = staticData[collectionName];
        return collection.items;
      }

      handleError(error);

    } finally {
      setStatus();
    }
  }

  async function fetchOne(id) {
    try {
      const url = `db/${collectionName}`;
      return await get(`${url}/${id}`);
    } catch (error) {
      handleError(error);
    }
  }

  async function init() {
    try {
      const collection = getCollection();
      
      if (collection.items.length > 0) {
        return collection.items;
      }

      return await fetchAll();
    } catch (error) {
      handleError(error);
    }
  }

  async function saveItem(newItem) {
    try {
      const collection = getCollection();
      collection.status = `saving new item to ${collectionName}`;
      // collection.isLoading = true;

      const savedItem = await post(`db/${collectionName}`, newItem);
      collection.status = null;
      collection.items.push(savedItem);

      setStatus();
      return savedItem;
    } catch (error) {
      handleError(error);
    }
  }

  async function updateItem(updates) {
    try {
      if(!updates._id) {
        return;
      }

      const collection = getCollection();

      collection.status = `updating ${collectionName}`;

      const savedItem = await put(`db/${collectionName}/${updates._id}`, updates);

      updatedCollectionCache(savedItem);

      collection.status = null;
    } catch (error) {
      handleError(error);
    }
  }

  async function removeItem(id) {
    try {
      if (!confirm('You sure?')) {
        return;
      }
      const collection = getCollection();
      collection.status = `removing ${collectionName}`;
      // collection.isLoading = true;
      await remove(`db/${collectionName}/${id}`);
      removeFromCache(id);
      setStatus();
    } catch (error) {
      handleError(error);
    }
  }

  // Step Functions

  function handleError(error) {
    const index = errorList.value.length;

    errorList.value.push(error);   

    setTimeout(() => {
      errorList.value.splice(index, 1);
    }, 3000);
  }

  function hasStaticData() {
    return staticData[collectionName];
  }

  function removeFromCache(id) {
    const collection = getCollection();
    collection.items = collection.items.filter((item) => item._id !== id);
  }

  function setStatus(newStatus, isLoading=false) {
    nextTick(() => {
      const collection = getCollection();
      collection.status = newStatus;
      collection.isLoading = isLoading;
    });
  }

  function updatedCollectionCache(updatedItem) {
    const collection = getCollection();

    collection.items = collection.items.map((i) => {
      if (i._id === updatedItem._id) {
        return updatedItem;
      }

      return i;
    });
  }

  return {
    getCollection,
    saveItem,
    fetchAll,
    fetchOne,
    init,
    updateItem,
    removeItem,
    errorList,
    database,
  };
}