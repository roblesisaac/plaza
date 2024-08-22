import { defineStore } from 'pinia';
import useApi from '../composables/useApi';

const { get, post, put, remove } = useApi();

export const useBoxStore = defineStore('box', {
  state: () => ({
    items: [],
    lastResponse: null,
    status: null,
    error: null
  }),
  
  actions: {

    async saveNewBox(box) {
        try {
            this.status = 'saving new box';
            const newBox = await post('db/boxes', box);
            this.status = null;
            this.items.push( newBox );
        } catch (error) {
            this.error = error;
        }
    },

    async fetchAllBoxes() {
        try {
            this.status = 'fetching all boxes';
            this.items = await get('db/boxes');
            this.status = null;
            return this.items;
        } catch (error) {
            this.error = error;
        }
    },

    async fetchBox(id) {
        try {
            const box = await get(`db/boxes/${id}`);
            return box;
        } catch (error) {
            this.error = error;
        }
    },

    async init() {
        try {
            if(this.items.length > 0) {
               return;
            }
   
            await this.fetchAllBoxes();
   
        } catch (error) {
            this.error = error;
        }
    },

    async updateBox(box) {
        try {
            this.status = 'updating box';
            const updatedBox = await put(`db/boxes/${box._id}`, box);
            this.items = this.items.map((item) => {
                if (item.id === box._id) {
                    return updatedBox;
                }
                return item;
            });
            this.status = null;
        } catch (error) {
            this.error = error;
        }
    },

    async remove(id) {
        try {
            if(!confirm('You sure?')) {
                return;
            }

            await remove(`db/boxes/${id}`);
            this.items = this.items.filter((item) => item._id !== id);
        } catch (error) {
            this.error = error;
        }
    }

    
  }

});
