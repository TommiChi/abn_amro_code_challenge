
function fetchData (endpoint: string) {
  const apiHost = 'https://api.tvmaze.com/';
  return fetch(apiHost + endpoint.replace(/^(\/)/, ''))
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Opps, something went wrong querying TVmaze')))
    .catch(error => error);
}

export const getShows = () => fetchData('shows');

export const getByDay = (year: number, month: number, day: number) => {
  const parsedMonth = `0${month + 1}`.slice(-2);
  const parsedDay = `0${day}`.slice(-2);
  const yearMonthDay = `${year}-${parsedMonth}-${parsedDay}`;

  return fetchData(`schedule?date=${yearMonthDay}`);
};

export const getEpisode = (id: number | string) => fetchData(`episodes/${id}?embed=show`).then((data) => ({ ...data, ...data._embedded, _embedded: null }));