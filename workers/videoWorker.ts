self.onmessage = (event) => {
    const { value } = event.data;
    const result = value * 2 * 2 * 4 *8 * 7 * 12 / 7 *  Math.random() ;

    self.postMessage({ result });
};
