var preprocess = function (context) {
    var self = this;

    self.processFile = function (srcPath, file) {
        return file;
    };
};

module.exports = preprocess;
