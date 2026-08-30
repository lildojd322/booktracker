const getHighResImage = (url) => {
    if (!url) return

    return url.replace('=s96-c', '=s400-c');
}

export default getHighResImage