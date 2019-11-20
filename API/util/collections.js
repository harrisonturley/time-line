function removeFromArray(arr, item) {
    const index = arr.indexOf(item);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

module.exports = {removeFromArray};