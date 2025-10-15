/**
 * PokeAPI return next url with http://localhost/
 * 
 * this function remove first part and return only part after 
 */
export const extractBaseAPI = (url: string, baseUrl: string): string => {

    return url.substring(url.indexOf(baseUrl));
}