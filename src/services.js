import axios from "axios";
import { API_BASE_URL } from './config'

const addNote = (note) => {
    return axios.post(`${API_BASE_URL}/notes`, note).then(
        response => {
            return Promise.resolve(response.data);
        },
        error => {
            return Promise.reject(error);
        }
    );
}

const getNotes = () => {
    return axios.get(`${API_BASE_URL}/notes`).then(
        response => {
            return Promise.resolve(response.data);
        },
        error => {
            return Promise.reject(error);
        }
    );
}

const deleteNote = (id) => {
    return axios.delete(`${API_BASE_URL}/notes/${id}`).then(
        response => {
            return Promise.resolve(response.data);
        },
        error => {
            return Promise.reject(error);
        }
    );
}

const editNote = (note, noteId) => {
    return axios.put(`${API_BASE_URL}/notes/${noteId}`, note).then(
        response => {
            return Promise.resolve(response.data);
        },
        error => {
            return Promise.reject(error);
        }
    );
}

const changeFilter = (newFilter) => {
    return axios.get(`${API_BASE_URL}/notes/change-filter/${newFilter}`).then(
        response => {
            return Promise.resolve(response.data);
        },
        error => {
            return Promise.reject(error);
        }
    );
}

export const noteServices = {
    addNote,
    getNotes,
    deleteNote,
    editNote,
    changeFilter
};
