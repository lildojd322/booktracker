const getHighResImage = (url) => {
    if (!url) return null;

    return url
        .replace('http://', 'https://')
        .replace('&zoom=1', '&zoom=1&fife=w300')  
       .replace('&edge=curl', '');  
}

export default getHighResImage;
