var rtc = null;
/**
 * 设置cookie
 * */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/";
    console.log(d)
}

/**
 * 读取cookies
 * */
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

var common = {
    // 获取sessionid初始化sdk，先读cookie，如果有存储的sessionid就用，没有就通过接口获取
    init: function(){
        var _this = this;
        // 拼接当前房间获取房间session值k
        var getSessionKey = _this.roomid + '_' + _this.userid + '_' +  _this.role;
        var sessionid = getCookie(getSessionKey);
        if(sessionid ){
            common.login(sessionid);
        }else{
            _this.getSessionId();
        }
    },

    getSessionId: function(){
        var _this = this;
        $.ajax({
            url: "https://ccapi.csslcloud.net/api/room/auth",
            type: "GET",
            dataType: "json",
            data: {
                userid: _this.userid,
                roomid: _this.roomid,
                name: _this.name,
                password: _this.password,
                role: _this.role,
                client: "0" //登录客户端类型：0: 浏览器， 1: 移动端 （必填）
            },
            success: function (data) {
                console.log(data);
                if(data.result === 'OK'){
                    var data = data.data;
                    var sessionid = data.sessionid;

                    console.log(sessionid);
                    // 拼接当前房间获取房间session值k
                    var getSessionKey = _this.roomid + '_' + _this.userid + '_' +  _this.role;
                    setCookie(getSessionKey, sessionid, 1);
                    common.login(sessionid);

                }else{
                    alert('登录接口验证失败');
                }
            }
        });
    },

    login: function(sessionid){
        //初始化
        rtc = new Rtc({
            userid: this.userid, // 用户ID
            sessionid: sessionid
        });

        rtc.on('login_success', function (data) {
            // 登录成功
            console.log(data,'login_success');


        });

        rtc.on('login_failed', function (err) {
            // 登录失败
            console.error('登录失败',err);
        });

        rtc.on('conference_join', function (streams) {
            console.log('conference_join', streams);
        });

        rtc.on('conference_join_failed', function (err) {
            // 加入房间失败
            console.log('加入房间失败',err);
        });


        rtc.on('stream_removed', function (stream) {
            // 删除流

            $('#'+ stream.id()).remove();

        });

        rtc.on('allow_sub', function (stream) {
            // 订阅流
            console.log('allow_sub', stream);

            if(stream instanceof Woogeen.RemoteMixedStream){
                console.log('是混合流,不定阅');

            }else{
                rtc.trySubscribeStream({
                    tryStream: stream,
                    success:function(stream){
                        // 订阅流成功
                        var streamId = stream.id(); // 获取流id
                        console.log('订阅流成功', streamId);

                        //将视频动态插入盒子中
                        var li = document.createElement('li');
                        li.setAttribute('id', streamId);
                        otherList.appendChild(li);
                        stream.show(streamId);
                    },
                    fail: function(err){
                        console.log(err);
                    }
                });
            }
        });

        rtc.on('server_disconnected', function (stream) {
            // 订阅流
            otherList.innerHTML='';

        });

        rtc.on('unSub', function(stream){
            rtc.unSubscribeStream({
                unSubStream: stream,
                success:function(id){
                    console.log('取消订阅成功', id);
                },
                fail: function(err){
                    console.log('取消订阅失败', err);
                }
            })
        });


    }
};



console.log('使用此demo前，必须确保你的roomid、userid、passeord、role是可用的');
//初始化	，传入房间id，用户id
common.roomid = '456D6F642FCF4E5A9C33DC5901307461';
common.userid = '83F203DAC2468694';
common.name = 'bobo'+ parseInt(Math.random()*100) ;
common.password ='123';//# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
common.role = 1;// 登录角色 0: 教师 ,    1:互动者，   2: 旁听者

common.init();






//页面已存在dom元素
var otherList = document.getElementById('others');
var open_live = document.getElementById('open_live');
var close_live = document.getElementById('close_live');
var publish_stream = document.getElementById('publish_stream');






//创建本地流
$('#creat_stream_main').on('click',function(){
    rtc.createLocalStream({
        streamName: 'main',
        success: function(stream){
            stream.show('my_1');  // 将本地流显示在元素id值为id的盒子中
        },
        fail: function(str){
            console.log(str);
        }
    });
});
$('#creat_stream_assist').on('click',function(){
    rtc.createLocalStream({
        streamName: 'assist',
        success: function(stream){
            stream.show('my_2');  // 将本地流显示在元素id值为id的盒子中
        },
        fail: function(str){
            console.log(str);
        }
    });
});
$('#creat_stream_picture').on('click',function(){
    rtc.createLocalStream({
        streamName: 'picture',
        success: function(stream){
            stream.show('my_3');  // 将本地流显示在元素id值为id的盒子中
        },
        fail: function(str){
            console.log(str);
        }
    });
});

//推送本地流
$('#publish_stream_1').on('click',function(){
    rtc.publish({
        streamName: 'main',
        videoRate: 300,
        audioRate: 50,
        success: function(stream){
            console.log('本地流推送成功', stream.id()); // 将本地流显示在元素id值为id的盒子中
        },
        fail: function(str){
            console.log(str);
        }
    });
});
$('#publish_stream_2').on('click',function(){
    rtc.publish({
        streamName: 'assist',
        videoRate: 300,
        audioRate: 50,
        success: function(stream){
            console.log('本地流推送成功', stream.id()); // 将本地流显示在元素id值为id的盒子中
        },
        fail: function(str){
            console.log(str);
        }
    });
});
$('#publish_stream_3').on('click',function(){
    rtc.publish({
        streamName: 'picture',
        videoRate: 300,
        audioRate: 50,
        success: function(stream){
            console.log('本地流推送成功', stream.id()); // 将本地流显示在元素id值为id的盒子中
        },
        fail: function(str){
            console.log(str);
        }
    });
});

// 开启直播
$(open_live).on('click',function(){
    rtc.startLive({
        success: function(data){
            console.log('开启直播成功', data);
        },
        fail: function(){
            console.log('开启直播失败');
        }
    });
});

// 关闭直播
$(close_live).on('click',function(){
    rtc.stopLive({
        success: function(){
            console.log('关闭直播成功');
        },
        fail: function(){
            console.log('关闭直播失败');
        }
    });
});



// 关闭本地视频
$('#close_my_vodeo_1, #close_my_vodeo_2, #close_my_vodeo_3').on('click', function(){

    var name = '';
    if($(this).attr('id') === 'close_my_vodeo_1'){
        name = 'main';
    }else if($(this).attr('id') === 'close_my_vodeo_2'){
        name = 'assist';
    }else if($(this).attr('id') === 'close_my_vodeo_3'){
        name = 'picture';
    }

    rtc.closeVideo({
        streamName: name,
        success: function(){
            console.log('关闭本地流成功');
        },
        fail: function(){
            console.log('关闭本地流失败');
        }
    });
});


//停止推送本地流
$('#unpublish_stream_1, #unpublish_stream_2, #unpublish_stream_3').on('click', function(){

    var name = '';
    if($(this).attr('id') === 'unpublish_stream_1'){
        name = 'main';
    }else if($(this).attr('id') === 'unpublish_stream_2'){
        name = 'assist';
    }else if($(this).attr('id') === 'unpublish_stream_3'){
        name = 'picture';
    }

    rtc.unPublish({
        streamName: name,
        success: function(id){
            console.log('停止推流成功', id);
        },
        fail: function(str){
            console.log(str);
        }
    });
});


//检查直播状态
$('#check_status').on('click', function(){
    rtc.getLiveStat({
        success: function(data){
            console.log('直播已开启', data);
        },
        fail: function(str){
            console.log('直播未开启或查询失败', str);
        }

    });
});


// 关闭音频
$('#close_audio').on('click', function(){
    rtc.pauseAudio({
        streamName: 'main',
        success: function(){
            console.log('操作成功')
        },
        fail: function(err){
            console.log(err);
        }


    });
});

// 打开音频
$('#open_audio').on('click', function(){
    rtc.playAudio({
        streamName: 'main',
        success: function(){
            console.log('操作成功')
        },
        fail: function(err){
            console.log(err);
        }


    });

});


// 关闭视频
$('#close_video').on('click', function(){
    rtc.pauseVideo({
        streamName: 'main',
        success: function(){
            console.log('操作成功')
        },
        fail: function(err){
            console.log(err);
        }
    });


});

// 打开视频
$('#open_video').on('click', function(){
    rtc.playVideo({
        streamName: 'main',
        success: function(){
            console.log('操作成功')
        },
        fail: function(err){
            console.log(err);
        }
    });

});

// 获取流状态
$('#getConnectionStats').on('click', function(){
    if(! Speaker.has_sub_streams[1]){
        console.log('不存在已订阅的流');
        return;
    }
    rtc.getConnectionStats({
        stream: Speaker.has_sub_streams[1],
        success: function(data){
            console.log(data);
        }
    });
});

// 获取设备列表
$('#get_device').on('click', function(){
    rtc.getDevice({
        success: function(data){
            console.log(data);
        },
        fail: function(str){
            console.log(str);
        }
    });
});



//卸载页面关闭本地流和本地远程流
window.onbeforeunload = function(){
    rtc.closeVideo({
        streamName: 'main'
    });
    rtc.closeVideo({
        streamName: 'assist'
    });
    rtc.closeVideo({
        streamName: 'picture'
    });

    rtc.closeRemoteStreams();
};




