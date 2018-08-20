var util = require('./util/HttpDownUtil');
var fs = require('fs');
url = 'https://www.baidupcs.com/rest/2.0/pcs/file?method=batchdownload&app_id=250528&zipcontent=%7B%22fs_id%22%3A%5B598494936570670%5D%7D&sign=DCb740ccc5511e5e8fedcff06b081203:9Alz1IljhPcH4YyQmUxkaS3F3hc%3D&uid=3007448498&time=1534826529&dp-logid=5369817710730672646&dp-callid=0&vuk=3007448498';
var i=0
var main = async(url) => {
    try {
        var task = await util.getTaskInfo(url);
        var chunkInfoList = task.buildChunkInfoList();
        var reqs = await util.getAllChunkRes(task);
        var promises = reqs.map((e, index) => {
            return new Promise((resolve, reject) => {
                var stream = fs.createWriteStream(`./down/${task.fileName}`, { start: chunkInfoList[index].nowStartPosition });
                e.on('response', (res) => {

                    if (res.statusCode == '206') {
                        res.on('data', (chunk) => {
                            stream.write(chunk);
                            task.chunkInfoList[index].downSize += chunk.length;
                            task.downSize += chunk.length;
                        });

                        res.on('end', () => {
                            console.log(i+=1)
                            console.log(index + ' is done')
                            resolve(index + ' is done');
                            stream.end();
                        });
                        // res.o vn('aborted', (e) => {
                        //     console.log(index + ' aborted 事件促发',e)
                        // });
                        res.on('error', (err) => {
                            resolve(index + ' is error:' + err.message)
                        });
                    } else {
                        console.log(res.statusCode);
                    }
                })
                e.on('error', (err) => {
                    console.log(err)
                })

            })
        })

        Promise.all(promises).then((result) => {
            console.log(result)
        })

    } catch (e) {
        throw e;
    }
}


main(url);