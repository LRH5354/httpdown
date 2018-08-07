var request = require('request');
var path = require('path');
var fs = require('fs');
// url from to dir index 分别是文件地址 起始位置  终止位置 存放位置 分块文件索引


function down(uri) {
    const dir = '百度云'
    downLoad.getFileInfo(uri).then((info) => {
            var form = {
                url: uri,
                length: info.length,
                duanshu:8,
                initTime:new Date().getTime()
            }
            console.log('获取文件信息成功', form.length);
            addDownItem(form);
            return form;
        })
        .then((form) => {
            if (fs.existsSync(path.join(downLoad.checkFilePath(dir), `pack.zip`))) {
                fs.unlinkSync(path.join(downLoad.checkFilePath(dir), `pack.zip`))
            }
              return downLoad.asyncDown(form, form.duanshu, form.length);

        })
        .then(() => {
            console.log('完成')
        })
}


function addDownItem(form) {
    $('.down-content').append(`<div class='layui-row down-item'>
                        <div class='layui-col-xs3'>pack.zip</div>
                        <div class='layui-col-xs3'> 
                        <div class="layui-progress layui-progress-big" lay-showPercent="yes">
                        <div class="layui-progress-bar layui-bg-green" lay-percent="50%" style="width: 0%;">
                        <span class="layui-progress-text">0%</span>
                        </div></div></div>
                        <div class='layui-col-xs2'>下载中</div>
                        <div class='layui-col-xs2'>
                        <div class="speed"></div></div>
                        <div class='layui-col-xs2'>${form.length}</div>
                    </div>`);
    //事件委托
    $('.down-content').on('click',function (e) {
        console.log('down-content事件')
        if($(e.target).is('.layui-progress')){
            console.log('process事件')
            var data = {   //数据
                "name": "pack.zip",
                "path": "D://",
                "speed": "0 mb/s",
                "statu": "ok",
                "length": "0",
                "duanshu": form.duanshu
            }
            layer.open({
                type: 1,
                title: '下载详情',
                area: ['450px', '600px'],
                shadeClose: true,
                content:"<div id='detial-view'></div>",
            });

            var Tpl = detial.innerHTML,
                view = document.getElementById('detial-view');
                laytpl(Tpl).render(data,function(html){
                view.innerHTML = html;
                downLoad.getNode($(".detial [type='process']"));
            });
        }
    })
}