const fs = require('fs');

const deleteFile = filePath => {
  fs.unlink(filePath, (error) => {
    if (error) {
      throw Error(error);
    }
  })
}

exports.deleteFile = deleteFile;