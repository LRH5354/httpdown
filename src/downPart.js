(function() {
    var request = require('request');
    var path = require('path');
    var fs = require('fs');
    var __dirname = './data';

    var lianJieShu_OK = 0;
    var counts_jindu=[];
    var pb;
    var loaded = 0;

    var time_init;
    var time_now;


    var downLoad = {
        counts_jindu:'',
        pb:'',
        downFile: function(url, from, to, dir, index, jiange, duanshu, length,initTime) {
            time_init=initTime;
            return new Promise((resolve, reject) => {
                var opt = {
                    url: `${url}`,
                    encoding: null,
                    headers: {
                        Range: `bytes=${from}-${to-1}`,
                    }
                }

                var dir = `${'百度云'}`;

                var stream = fs.createWriteStream(path.join(downLoad.checkFilePath(dir), `pack.zip`), { start: from })

                var req = request(opt);

                req.on('response', (res) => {
                    var len = res.headers['content-range'];    
                    var $$=len.split('/')[0].split('-');
                    console.log(index,len)
                    counts_jindu[index]={
                        'writeStream':stream,
                        'readStream':res,
                        'jianGe':$$[1]-$$[0],
                        'jindu':0
                    };

                    if (res.statusCode == '206') {

                        lianJieShu_OK++;
                        res.on('data', (data) => {
                                time_now=new Date().getTime();

                                stream.write(data);
                                loaded = loaded + data.length;

                                counts_jindu[index].jindu= counts_jindu[index].jindu+data.length;
                            counts_jindu[index].readStream=res;
                           //     downLoad.counts_jindu=counts_jindu;
                                var  pc = (loaded / length) * 100; //百分比
                                $('.down-item .layui-progress-bar').css('width', `${pc}%`);
                                $('.down-item .layui-progress-bar .layui-progress-text').text(`${Math.ceil(pc)}%`);
                                $('.down-item .speed').text(Math.ceil((loaded/1024)/((time_now-initTime)/1000))+'kb/s');
                           
                                downLoad.render(pb,counts_jindu);
                            })
                            .on('end', () => {
                    
                                resolve();
                            })
                            .on('error',() => {
                                throw new error('出错！！！')
                            })
                    } else {
                        downLoad.render(pb,counts_jindu,index);
                        console.warn('链接不成功 状态码：', res.statusCode);
                        console.log('重新尝试下载。。。。。');
                        downLoad.downFile(url, from, to, dir, index, jiange, duanshu, length,initTime)
                    }


                })

            })

        },
        getFileInfo: function(url) {

            var opt = {
                url: `${url}`,
                encoding: null,
                headers: {
                    Range: 'bytes=0-2'
                }
            }
            return new Promise((resolve, reject) => {
                request(opt, (err, res, body) => {
                    if (err) {
                        console.log(err.message)
                    }

                    console.log(res.headers)
                    var fileInfo = {
                         length: res.headers['content-length'], //文件的字节长度
                        'down-id':new Date().getTime(),
                }
                    resolve(fileInfo)
                })
            })

        },

        //队列循环执行操作
        queueDown: function(form, duanShu) {
            var promise = Promise.resolve('初始化')
            var jianGe = Math.ceil(form.length / duanShu);

            for (var i = 0; i <= (duanShu - 1); i++) {
                (function u(i) {
                    promise = promise.then(() => {
                        return downLoad.downFile(form.url, i * jianGe, (i + 1) * jianGe, 'data', i, jianGe, duanShu);
                    })

                })(i)
            }

            return promise;
        },
        //根据段数同时进行下载
        asyncDown: function(form, duanShu, length) {
            var promise = [];
            var jianGe = Math.ceil(form.length / duanShu);
             console.log(jianGe)
            for (var i = 0; i < duanShu; i++) {
                promise.push(downLoad.downFile(form.url, i * jianGe, (i + 1) * jianGe, 'data', i, jianGe, duanShu, length,form.initTime))
            }

            return Promise.all(promise)

        },

        checkFilePath: function(p) {
            var dirPath = path.join(__dirname, p);
            try {
                fs.accessSync(dirPath, fs.F_OK);
            } catch (e) {
                fs.mkdirSync(dirPath)
            }
            return dirPath;
        },

        getNode:function (nodes) {
            downLoad.pb= pb=nodes;
        },
        render:function (pb,data) {
         if(pb){
              pb.each((index,element)=>{
                 $($(element).find('.layui-progress-bar')).css('width', `${Math.ceil((data[index].jindu/data[index].jianGe)*100)}%`);
                 $($(element).find('.layui-progress-bar .layui-progress-text')).text( `${Math.ceil((data[index].jindu/data[index].jianGe)*100)}%`);
                 $($(element).find('.speed')).text(`${data[index].readStream.readableFlowing}`);
              })
         }
        }
    }


    if (typeof module === 'object' && module.exports) {
        module.exports = downLoad;
    } else {
        window.downLoad = downLoad;
    }


})()