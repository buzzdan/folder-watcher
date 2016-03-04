export default (filename) => {
    if (!filename.endsWith('.txt')) {
        var now = new Date().toLocaleTimeString().split(':', 2);
        return now[0].toString() + now[1].toString() + filename;
    }
    return filename;
}