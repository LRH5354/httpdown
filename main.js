/**
 *作者  15879 -  LRH
 *创建时间 2018  2018/8/1  9:27
 **/
layui.use(['layer', 'laytpl', 'form', 'element', 'jquery'], function() {
        layer = layui.layer,
        form  = layui.form,
        element = layui.element,
        laytpl = layui.laytpl,
        $ = layui.jquery;

        element.on('tab(demo)', (data) => {
           layer.msg(data.index)
        });


    //弹出一个页面层
    $('.createdown').on('click', function() {
        layer.open({
            type: 1,
            title: '添加下载',
            area: ['600px', '200px'],
            shadeClose: true, //点击遮罩关闭
            content: "<div style='padding:20px';> <div id='url' class='layui-form-labelitem'>" +
                    "<label class='layui-form-label'>直链</label>" +
                    "<div class='layui-input-block'>" +
                    "<input type='text' name='title' required  lay-verify='required' placeholder='请输入url' autocomplete='off' class='layui-input' value='https://www.baidupcs.com/rest/2.0/pcs/file?method=batchdownload&app_id=250528&zipcontent=%7B%22fs_id%22%3A%5B580096494365883%5D%7D&sign=DCb740ccc5511e5e8fedcff06b081203:d%2B8tYeVAH8e1A373p4Z1P18yoLU%3D&uid=3007448498&time=1533520639&dp-logid=5019270559399761656&dp-callid=0&vuk=3007448498' >" +
                    "</div></div></div>",
            btn: ['确认', '取消'],
            yes: function(index, element) {
                var url = $('#url input').val();
                down(url);
                layer.close(index)
            },
            btn2: function() {
                layer.msg('取消成功')
            }
        });
    });



})