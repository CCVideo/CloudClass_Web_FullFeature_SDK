/**
 * 选择文件上传绑定, 方法监听
 */
$(document).on('change', '.upload-file-btn #file-upload', function (e) {
    e.stopPropagation();
    //上传文件
    new DocumentUpload({
        mode: 2,       // 0 不支持ppt动画  1 支持一般ppt动画  2 支持极速ppt动画
        files: $('#file-upload')[0].files[0],
        uploadCallbackFailed: handleUploadCallbackFailed,
        uploadCallbackBefore: handleUploadCallbackBefore,
        uploadCallbackSuccess: handleUploadCallbackSuccess
    })
});

/**
 *  上传失败的回调函数的回调函数
 */
function handleUploadCallbackFailed (error, time) {
    if(time){
        $('#'+time).css('background','#e64737');
        $('#'+time).text('文件上传失败，请重试');
        $('#'+time).css('padding-left','15px');
        setTimeout(function(){
            $('#'+time).remove();
        },3000)
    }
    alert(error);
}

/**
 * 上传文件的之前的回调函数
 * @param timestamp
 * @return {*}
 */
function handleUploadCallbackBefore (timestamp) {
    docShow.appendUnDoneDoc(timestamp)
}

/**
 *  上传文件成功后的回调函数
 * @param data
 * @param timestamp
 * @return {*}
 */
function handleUploadCallbackSuccess (data, timestamp) {

    setTimeout(function(){
        var num = 80;
        docShow.timer_upload = setInterval(function(){
            if(num < 100){
                num += 10;
                $('#showdoclist .docli #show').css({
                    'background': '#f27c19',
                    'width': num + '%'
                });
                $('#showdoclist .docli .progress').text('文件已上传'+ num + '%');
            }else{
                clearInterval(docShow.timer_upload);
            }
        },80);

        setTimeout(function(){
            // 需要轮训查看文档是否转化完成
            if (typeof docShow.uploadFileDoing === 'function') {
                docShow.uploadFileDoing(data.datas.docId, timestamp);
            }
        },200);
    },1000);
}
/***
 * 已上传文档展示、删除功能， 次模块仅在教师端使用
 */
var timers = []; // 存储上传中文件定时器变量
var upload_docid = [];  // 存储正在上传文件id

var docShow = {
    // 机构文档库文档展示
    get_instruction_Docs:function (data) {
        // 已完成文档
        if (data.docs.length > 0) {
            for (var i = 0; i < data.docs.length; i++) {
                var name = data.docs[i].name,
                    id = data.docs[i].id,
                    useSDK = data.docs[i].useSDK,
                    pic_roomid = data.docs[i].roomId,
                    mode = data.docs[i].mode ? data.docs[i].mode : 0,
                    status = data.docs[i].status,
                    totalpage = data.docs[i].pageSize;
                var pic_domain = data.picDomain.replace('http:', '').replace('https:', '');
                // 转化成功文档
                if(status === 1){
                    if ($('#' + id).length <= 0) {
                        // $('.doc-bottom-in').append(str);
                        var name_sp = name.split('.');
                        var name_extension = name_sp[name_sp.length-1];
                        if(name_extension=='doc'||name_extension=='docx'){
                            var icon_type = 'W';
                            var icon_class = 'upicon_blue';
                        }else if(name_extension=='ppt'||name_extension=='pptx'){
                            var icon_type = 'P';
                            var icon_class = 'upicon_yew';
                        }else if(name_extension=='pdf'){
                            var icon_type = 'P';
                            var icon_class = 'upicon_gren';
                        }else if(name_extension =='jpg'){
                            var icon_type = 'J';
                            var icon_class = 'upicon_gren';
                        }
                        if(name_sp[0].length>10){
                            var name_s = name_sp[0].substring(0,10)+'...';
                        }else{
                            var name_s = name_sp[0]
                        }
                        $('#showdoclist').append('<div class="docli" title="' + name + '" id="' + id + '"usesdk="'+ useSDK +'" totalpage="' + totalpage + '" domain="'+pic_domain+  '" pic_roomid="'+ pic_roomid +'" mode="'+ mode + '"><i class="material-icons icon-logol '+icon_class+'">'+icon_type+'</i>'+name_s+'.'+name_sp[1]+'<i class="material-icons doc-delete-icon instr_del">delete</i></div>');
                    }
                }

                // 转化中
                if(status === 0 || status === 2){
                    if ($('#' + id).length <= 0) {
                        var unStr = '<div class="docli" title="' + name + '" id="' + id + '" totalpage="'+totalpage+'" domain="'+pic_domain+'" style="background:#f27c19;color:#fff;">文件转化中....</div>';
                        $('#showdoclist').append(unStr);
                        docShow.uploadFileDoing(id, false);

                    }
                }

            }
        }
        setTimeout(function () {
            rtc.emit('docs_append');
        }, 1000);
    },

    getInstructionFailed: function (data) {
        alert(data);
    },

    // 未转化完成文档处理，未转化完成文档，需定时拉取状态，直至转化完成
    uploadFileDoing: function (docId, timestamp){
        if(timestamp){
            $('#'+timestamp).attr('id', docId);
        }
        docTimer = setInterval(function () {
            rtc.getSingleDocument({
                docId: docId,
                getSingleDocumentCallback: docShow.getSingleDoc
            });
        }, 3000);
        timers.push(docTimer);
        upload_docid.push(docId);
    },

    getSingleDoc: function (data, docid) {
        var pic_domain = data.picDomain.replace('http:', '').replace('https:', '');
        data = data.docs[0];
        var status = data.status,
            id = data.id,
            name = data.name,
            useSDK = data.useSDK,
            pic_roomid = data.roomId,
            totalpage = data.pageSize,
            mode = data.mode;
        // 转化失败
        if(status === 3){
            $.growl.error({message: '文件转化失败'});
            var docid_index = upload_docid.indexOf(docid);
            if (docid_index != -1){
                clearInterval(timers[docid_index]);
                timers.splice(docid_index, 1);
                upload_docid.splice(docid_index, 1);
            }
            $('#'+id).css('background','#e64737');
            $('#'+id).text('文件上传失败，请重试');
            setTimeout(function(){
                $('#'+id).remove();
            },2000);
            return
        }

        $('#'+id).attr('totalpage', totalpage);
        $('#'+id).attr('usesdk', useSDK);
        $('#'+id).attr('mode', mode);
        $('#'+id).attr('pic_roomid', pic_roomid);

        // 转化成功
        if (status === 1) {
            var docid_index = upload_docid.indexOf(id);
            if (docid_index != -1){
                clearInterval(timers[docid_index]);
                timers.splice(docid_index, 1);
                upload_docid.splice(docid_index, 1);
            }
            //文档库上传文件进度条，上传完成
            var name_sp = name.split('.');
            var name_extension = name_sp[name_sp.length-1];
            if(name_sp[0].length>10){
                var name_s = name_sp[0].substring(0,10)+'...';
            }else{
                var name_s = name_sp[0]
            }
            $('#'+id).text(name_s+' .'+name_sp[1]);
            $('#'+id).css('color','#333');
            $('#'+id).css('background','');
            if(name_extension=='doc'||name_extension=='docx'){
                var icon_type = 'W';
                var icon_class = 'upicon_blue';
            }else if(name_extension=='ppt'||name_extension=='pptx'){
                var icon_type = 'P';
                var icon_class = 'upicon_yew';
            }else if(name_extension=='pdf'){
                var icon_type = 'P';
                var icon_class = 'upicon_gren';
            }else if(name_extension =='jpg'){
                var icon_type = 'J';
                var icon_class = 'upicon_gren';
            }
            $('#'+id).prepend('<i class="material-icons icon-logol '+icon_class+'">'+icon_type+'<i/>');
            $('#'+id).append('<i class="material-icons doc-delete-icon instr_del">delete</i>');
            $('#'+id).attr('domain', pic_domain);
        }

        // 转化中
        if(status === 0 ||status === 2 ){
            // 文档库上传文件进度条
            $('#'+id).css('background','#f27c19');
            var str = '<div class="spinner"></div>';
            $('#'+id).html('<span style="position: absolute; z-index: 5;color: #fff;font-size: 14px; top: -5px;left: 50px;">文件转化中....</span>');
            $('#'+id).append(str);
        }

    },


    // 上传模拟动画处理
    appendUnDoneDoc: function(timestamp){
        var undoneId = timestamp||'',
            undoneName = '', totalpage='';
        var doclibox = '<div class="docli" title="' + undoneName + '" id="' + undoneId + '" totalpage="' + totalpage + '" domain="" style="background: #888;color:#fff;position: relative"><div id="show"style="position: absolute;top: 0;left: 0;height: 100%;z-index: 1;"></div><span class="progress" style="position: absolute;top: -5px;left: 10px;z-index: 2; color: #fff;font-size:12px ;border: none;">文件开始上传</span></div>';
        $('#showdoclist').append(doclibox);
        var num = 0;
        var _this = this;
        this.timer_upload = setInterval(function(){
            if(num < 80){
                num += 10;
                $('#showdoclist .docli #show').css({
                    'background': '#f27c19',
                    'width': num + '%'
                });
                $('#showdoclist .docli .progress').text('文件已上传'+ num + '%');
            }else{
                clearInterval(_this.timer_upload);
            }
        },125);
    },
    // 删除文档结果处理
    deleteDoc: function (data, docid){
        if (data.result !== 'OK'){
            alert('err:'+data.errorMsg+'');
        }else{
            $('#'+docid+'').remove();
            if(docid === Doc.id){
                $('#WhiteBorad').trigger('click');
            }
        }
    }

};











/**
 * 文档操作
 *
 */
var DOC = {
    init: function(){
        // 点击显示文档列表
        $(document).on('click', '#dochouse', function(){
            $('.dochouse-box').show();
        });
        // 点击隐藏文档列表
        $(document).on('click', '.dochouse-box .clear', function(){
            $('.dochouse-box').hide();
        });

        // 点击切换文档
        $(document).on('click', '#showdoclist .docli', function(){
            // 切换选中项
            $(this).addClass("current").siblings().removeClass("current");
            //判断当前是白板还是文档
            var docData = {
                action: 'changeDoc',
                data: {
                    name: 'WhiteBorad',
                    id: 'WhiteBorad',
                    totalpage: 1
                }
            };
            if($(this).attr('title') !== 'WhiteBorad'){

                var name = $(this).attr('title'),
                    id = $(this).attr('id'),
                    mode = $(this).attr('mode'),
                    docFromRoomId = $(this).attr('pic_roomid'),
                    useSDK = parseInt($(this).attr('usesdk')),
                    totalpage = $(this).attr('totalpage');


                // 判断文档是否正在上传
                for(i in upload_docid){
                    if (upload_docid[i] === id){
                        alert('上传中');
                        return
                    }
                }
                docData.data.name = name;
                docData.data.id = id;
                docData.data.totalpage = totalpage;
                docData.data.docFromRoomId = docFromRoomId;
                docData.data.mode = mode;
                docData.data.useSDK = useSDK;
            }
            // 隐藏文档库
            $('.dochouse-box').hide();

            rtc.docChange(docData);
        });

        //文档库删除文件
        $(document).on('click', '#showdoclist .doc-delete-icon', function(e){
            e.stopPropagation();
            var docid = $(this).parent('.docli').attr('id');
            if(!docid){
                alert('删除的文档不存在')
            }
            var con = confirm('确定删除文档吗???');
            if (con){
                if($(this).hasClass('instr_del')) {
                    rtc.cancelDocument({
                        docId: docid,
                        cancelDocumentSuccess: DOC.deleteSingleSuccess,
                        cancelDocumentFailed: DOC.cancelDocFailed
                    });
                }
            }
        });

        // 上一页
        var changetag = 0;// 标示800ms内不可重复点击
        $(document).on('click', '.effect-pre', function(){
            if(changetag === 0){
                changetag = 1;
                setTimeout(function () {
                    changetag = 0;
                }, 800);
                var docData = {
                    action: 'pre'
                };
                rtc.docChange(docData);
            }
        });

        // 下一页
        $(document).on('click', '.effect-next', function(){
            if(changetag === 0){
                changetag = 1;
                setTimeout(function () {
                    changetag = 0;
                }, 800);

                var docData = {
                    action: 'next'
                };
                rtc.docChange(docData);
            }
        });

        // 缩小
        $(document).on('click', '.effect-narrow', function(){
            if(changetag == 0 && !$(this).hasClass('disabled')){
                var docData = {
                    action: 'narrow'
                };
                rtc.docChange(docData);


            }
        });

        // 放大
        $(document).on('click', '.effect-enlarge', function(){
            if(changetag == 0 && !$(this).hasClass('disabled')){
                var docData = {
                    action: 'enlarge'
                };
                rtc.docChange(docData);
            }
        });

        // 全屏
        $(document).on('click', '.effect-full', function(){
            // 按钮切换
            $('.effect-fullexit').show();
            $('.effect-full').hide();

            var docData = {
                action: 'full'
            };
            rtc.docChange(docData);

        });

        // 退出全屏
        $(document).on('click', '.effect-fullexit', function(){
            $('.effect-full').show();
            $('.effect-fullexit').hide();
            var docData = {
                action: 'exitFull'
            };
            rtc.docChange(docData);
        });

        //显示文档预览缩略图
        $(document).on('click', '.effect-preview', function(){
            $('.docview').show();
        });

        // 关闭预览缩略图
        $(document).on('click', '.docview .clear', function(){
            $('.docview').hide();
        });

        // 跳转至缩略图所在页
        $(document).on('click', '#docviews .docview-slide' ,function(){
            $(this).addClass("current").siblings().removeClass("current");
            var num = parseInt($(this).find('i').text());
            $('.docview').hide();
            var docData = {
                action: 'skip',
                data:{
                    toPage: num
                }
            };
            rtc.docChange(docData);
        });


        // 新增白板
        $(document).on('click', '.add-board', function(){
            var docData = {
                action: 'addBoard'
            };
            rtc.docChange(docData);
        });

        // 显示删除白板按钮
        $(document).on('mouseover', '.board-slide', function(){
            $('.deleteBoard').css('display', 'none');
            // 至少保留一个白板
            if($('.deleteBoard').length > 1){
                $(this).find('.deleteBoard').css('display', 'block');
            }
        });

        $(document).on('mouseout', '.board-slide', function(){
            $(this).find('.deleteBoard').css('display', 'none');
        });

        // 删除白板
        $(document).on('click', '.deleteBoard', function(e){
            e.stopPropagation();
            //  删除第几页白板
            var num = $('.deleteBoard').index(this) + 1;
            var isDelete = confirm('确认删除？');
            if(isDelete){
                var docData = {
                    action: 'deleteBoard',
                    data:{
                        page: num
                    }
                };
                rtc.docChange(docData);
            }

        });

    },
    deleteSingleSuccess: function (data, docId) {
        if (docId){
            $('#' + docId).remove();
        }
        if(docId === changeDocMessage.docId){
            $('#WhiteBorad').trigger('click');
        }
    },
    deleteSingleFailed: function () {
        alert('删除文件失败!')
    },

    cancelDocFailed: function () {
        alert('取消关联文档失败!')
    }
};

// 初始化文档操作事件
DOC.init();






// 更改文档缩略图，页码，缩放比例，
var changeDocMessage = {
    docId:'',
    changeDoc: function(data){
        this.docId = data.id;
        $('#docviews .chioce').html('');


        if(data.id === 'WhiteBorad'){
            // 白板显示现有白板模版
            var totalNum = data.totalPage;
            for (var i = 0; i < totalNum; i++){
                var num = i + 1;
                // 图片路径需自定义
                var img = '../css/img/deleteBoard.png';
                // 文档预览
                var docviewdom_slide = '<div class="docview-slide  board-slide"><img class="deleteBoard" src="' + img + '" /><i class="num">' + num + '</i></div>';
                $('#docviews .chioce').append(docviewdom_slide);
            }
            var addimg = '../css/img/addNewBoard_2.png';
            var addBoardStr = '<div class="docview-add add-board"><img src="'+ addimg +'"></div>';
            $('#docviews .chioce').append(addBoardStr);

        }else{
            // 文档将缩略图插入预览区
            var urlArr = data.urlArr;
            for (var i = 0; i < urlArr.length; i++){
                var img = urlArr[i];
                var num = i + 1;
                // 文档预览
                var docviewdom_slide = '<div class="docview-slide"><img src="'+ img +'"><i class="num">' + num + '</i></div>';
                $('#docviews .chioce').append(docviewdom_slide);
            }

        }

    },
    flip: function(data){
        if(data.name === 'WhiteBorad'){
            $('.doc-bottom-effect .add-board').show();
            $('.doc-bottom-effect .effect-narrow').hide();
            $('.doc-bottom-effect .effect-enlarge').hide();
        }else{
            $('.doc-bottom-effect .add-board').hide();
            $('.doc-bottom-effect .effect-narrow').show();
            $('.doc-bottom-effect .effect-enlarge').show();

        }
        $('#docviews .docview-slide').eq(data.currentPage - 1).addClass('current').siblings().removeClass("current");
        $('.effect-pagenum .currentPage').html(data.currentPage);
        $('.effect-pagenum .totalpage').html(data.totalPage);

    },
    scale: function(data){

        $('.effect-zoom').text(data.percent * 100 +'%');
        if(data.percent === 0.2){
            $('.doc-bottom .shrink').addClass('disabled');
            $('.doc-bottom .enlarge').removeClass('disabled');
        }else if(data.percent === 2){
            $('.doc-bottom .shrink').removeClass('disabled');
            $('.doc-bottom .enlarge').addClass('disabled');
        }else{
            $('.doc-bottom .shrink').removeClass('disabled');
            $('.doc-bottom .enlarge').removeClass('disabled');
        }
    },
    history: function(data){
        var id = data.id;
        $('#' + id ).click().addClass('current').siblings().removeClass("current");
    }
};











/**
 * 画笔种类、粗细、颜色选取区域，此模块只在教师端使用
 *
 */

// 画笔种类选取
$(document).on('click', '.control-box button', function(e){
    e.stopPropagation();
    var drap_type = $(this).attr('id');
    var drawType;
    switch(drap_type){
        // 划线
        case 'draw_line':
            drawType = 2;
            break;
        // 画方
        case 'draw_square':
            drawType = 3;
            break;
        // 画圆
        case 'draw_circle':
            drawType = 4;
            break;
        // 文字
        case 'draw_text':
            drawType = 5;
            break;
        // 删除上一笔
        case 'delet_before':
            drawType = 9;
            break;
        // 清屏
        case 'clear':
            drawType = 0;
            break;
        // 橡皮擦
        case 'erasure':
            drawType = 10;
            break;
        // 直线
        case 'straightLine':
            drawType = 11;
            break;
        // 激光笔
        case 'fluorescence':
            drawType = 12;
            break;
        // 荧光笔
        case 'laserPen':
            drawType = 13;
            break;
    }
    var drawData = {
        action: 'type',
        value: drawType
    };
    // 调用更改画笔接口
    rtc.drawChange(drawData);


    if(drawType === 2 || drawType === 3 || drawType === 4 || drawType === 5 ||drawType === 10 ||drawType === 11 ||drawType === 13){
        $('#draw-parent .draw-type').css('display', 'block');
        $(this).addClass("current").siblings().removeClass("current");
        if (drawType === 5) {
            $('.draw-type .thick').css('display','none');
            $('.draw-type .text').css('display','block');
        }else{
            $('.draw-type .thick').css('display','block');
            $('.draw-type .text').css('display','none');
        }
    }else if(drawType === 9 || drawType === 0 ){
        $('#draw-parent .draw-type').css('display', 'none');
    }else if(drawType === 12 ){
    	$(this).addClass("current").siblings().removeClass("current");
    }
});

// 画笔粗细选取
$(document).on('click', '.thick li', function (e) {
    e.stopPropagation();
    var thickness = parseInt($(this).attr('title'));
    var drawData = {
        action: 'thickNess',
        value:thickness
    };
    // 调用更改画笔接口
    rtc.drawChange(drawData);
    $(this).addClass("current").siblings().removeClass("current");
});

// 颜色选取
$(document).on('click', '.color li', function (e) {
    e.stopPropagation();
    var color = $(this).attr('title');
    var drawData = {
        action: 'color',
        value:color
    };
    // 调用更改画笔接口
    rtc.drawChange(drawData);
    $(this).addClass("current").siblings().removeClass("current");
});

// 字体大小选取
$("#font-sel").change(function(e){
    e.stopPropagation();
    var size = parseInt($('#font-sel').find('option:selected').html());
    var drawData = {
        action: 'size',
        value: size
    };
    // 调用更改画笔接口
    rtc.drawChange(drawData);
});

$(document).on('click', '#font-sel', function (e){
    e.stopPropagation();
});

$(document).bind('click', function(){
    $('.draw-type').hide();
});








