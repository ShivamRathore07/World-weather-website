export const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const Title = ['Country Name', 'Capital', 'Region', 'Alpha2 Code', 'Alpha3 Code'];
export const filterByRegion = ['Asia', 'Europe', 'Africa', 'Oceania', 'Americas', 'Polar'];