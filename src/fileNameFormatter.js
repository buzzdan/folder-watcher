export default (filename) => {
    if (!filename.endsWith('.txt')) {
        let now = new Date();
        return now.getHours().toString() + now.getMinutes().toString() + filename;
    }
    return filename;
}