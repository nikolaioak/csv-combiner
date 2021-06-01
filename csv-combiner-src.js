const csv = require('fast-csv');
const fs = require('fs');

function csvCombine(outputFilePath, csvFilePaths) {
    const promises = csvFilePaths.map((path) => {
        return new Promise((resolve) => {
            const dataArray = [];
            return csv
                .parseFile(path, {headers: true})
                .on('data', function(data) {
                    dataArray.push(data);
                })
                .on('end', function() {
                    resolve(dataArray);
                });
        });
    });
  
    return Promise.all(promises)
        .then((results) => {
  
            const csvStream = csv.format({headers: true});
            const writableStream = fs.createWriteStream(outputFilePath);
  
            writableStream.on('finish', function() {
                console.log(`Completed combining ${csvFilePaths.length} CSV Files.`);
            });
  
            csvStream.pipe(writableStream);
            results.forEach((result) => {
                result.forEach((data) => {
                    csvStream.write(data);
                });
            });
            csvStream.end();
        });
}

module.exports = csvCombine;