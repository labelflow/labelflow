module.exports = {
  init(providerOptions) {
    // init your provider if necessary

    return {
      upload(file) {
        // upload the file in the provider
      },
      delete(file) {
        // delete the file in the provider
      },
    };
  },
};
