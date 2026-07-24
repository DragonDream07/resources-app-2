import api from './api';

const searchService = {
  search: (params) =>
    api.get('/search', { params }).then((res) => res.data),

  autocomplete: (params) =>
    api.get('/search/suggest', { params }).then((res) => res.data),
};

export default searchService;
