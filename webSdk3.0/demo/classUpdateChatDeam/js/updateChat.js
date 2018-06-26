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
            sessionid: sessionid,
        });

        rtc.on('login_success', function (data) {
            // 登录成功
            console.log(data, 'login_success');
            // 通过房间配置对象, roomOptions存储更新后的房间配置数据
            Speaker.roomOptions.isFollow = data.is_follow;
            Speaker.roomOptions.classTpye = data.class_type;
            Speaker.roomOptions.maxStreams = data.max_streams;
            Speaker.roomOptions.allowChat = data.allow_chat;
            Speaker.roomOptions.allowAudio = data.allow_audio;
            Speaker.roomOptions.allowSpeak = data.allow_speak;
            Speaker.roomOptions.videoMode = data.video_mode;
            Speaker.roomOptions.template = data.template;

            // 调取聊天记录的方法
            rtc.getHistory();
        });
        /**
         * 房间配置项的更新的监听
         *
         */

        /**
         * 房间模板模式更新
         * @type: roomTemplateTypeChange
         * @function: rtc.on('roomTemplateTypeChange')
         */
        rtc.on('roomTemplateTypeChange', function (data) {
            console.log(data, '房间模板更新成功监听回调');
            popToReminder('房间模板更新成功监听回调');            
        });

        /**
         * 其他端的监听跟随摸式的更新
         * @type: roomSettingHasFollow
         * @function: rtc.on('roomSettingHasFollow')
         */
        rtc.on('roomSettingHasFollow', function (data) {
            console.log(data, '跟随摸式的更新成功监听回调');
            popToReminder('跟随摸式的更新成功监听回调');
        });

        /**
         * 连麦摸式的更新的监听
         * @type: classTypeChange
         * @function: rtc.on('classTypeChange')
         */
        rtc.on('classTypeChange', function (data) {
            console.log(data, '连麦的摸式更新成功监听回调');
            popToReminder('连麦的摸式更新成功监听回调');
        });

        /**
         * 连麦音视频模式监听到变化:
         * @type: video_mode
         * @value: 1, 2,
         * @param: 1: 音屏和视频, 2: 音频
         * @function: videoModeChange
         */
        rtc.on('videoModeChange', function (data) {
            console.log('连麦音视频模式');
            popToReminder('连麦音视频模式监听回调');
        });

        /**
         * 设置全体禁言/开言监听到变化:
         * @type: allow_chat
         * @value: true, false
         * @param: true: 开言, false: 禁言
         * @function: allowChatChange
         */
        rtc.on('allowChatChange', function (data) {
            console.log('设置全体禁言/开言监听到变化');
            popToReminder('设置全体禁言/开言监听到变化监听回调');
        });

        /**
         * 设置全体关闭麦克风/打开麦克风监听到变化:
         * @type: allow_audio
         * @value: true, false
         * @param: true: 全体关闭麦克风, false: 全体打开麦克风
         * @function: allowAudioChange
         */
        rtc.on('allowAudioChange', function (data) {
            console.log('设置全体关麦变化监听回调');
            popToReminder('设置全体关闭麦克风/打开麦克风监听回调');
        });

        /**
         * 设置全体下麦/上麦监听到变化:
         * @type: allow_speak
         * @value: true, false
         * @param: true: 全体下麦, false: 全体没有下麦
         * @function: allowSpeakChange
         */
        rtc.on('allowSpeakChange', function (data) {
            console.log('设置全体下麦变化监听回调');
            popToReminder('设置全体下麦/上麦监听回调');
        });

        /**
         * 讲师端设置码率修改监听到变化:
         * @type: publisher_bitrate
         * @value: {Number} 不超过2000
         * @function: publisherBitrateChange
         */
        rtc.on('publisherBitrateChange', function (data) {
            console.log('老师端设置码率修改变化监听回调');
            popToReminder('老师端设置码率修改变化监听回调');
        });

        /**
         * 学生端设置码率修改监听到变化:
         * @type: talker_bitrate
         * @value: {Number} 不超过2000
         * @function: talkerBitrateChange
         */
        rtc.on('talkerBitrateChange', function (data) {
            console.log('学生端设置码率修改变化监听回调');
            popToReminder('学生端设置码率修改变化监听回调');
        });
        rtc.on()

        /**
         * 用户列表的配置项更新的监听
         * @type: rtc.on()
         */

        // 监听到的单独禁言配置更新
        rtc.on('allowChatClose', function (data) {
            console.log(data, '用户单独禁言配置监听的回调数据');
            popToReminder('用户单独禁言配置监听的回调数据');
        });


        // 监听到的单独允许发言的配置更新
        rtc.on('allowChatOpen', function (data) {
            popToReminder('用户单独允许发言配置监听的回调数据');
        });

        // 监听用户单独关闭音频配置更新
        rtc.on('allowAudioClose', function (data) {
            console.log(data, '用户单独关闭音频配置监听的回调数据');
            popToReminder('用户单独关闭音频配置监听的回调数据');
        });

        // 监听用户单独打开音频配置更新
        rtc.on('allowAudioOpen', function (data) {
            console.log(data, '用户单独打开音频配置监听的回调数据');
            popToReminder('用户单独打开音频配置监听的回调数据');
        });

        // 监听用户单独关闭视频配置更新
        rtc.on('allowVideoClose', function (data) {
            console.log(data, '用户单独关闭视频配置更新监听的回调数据');
            popToReminder('用户单独关闭视频配置更新监听的回调数据');
        });

        // 监听用户单独打开视频配置更新
        rtc.on('allowVideoOpen', function (data) {
            console.log(data, '用户单独打开视频配置更新监听的回调数据');
            popToReminder('用户单独打开视频配置更新监听的回调数据');
        });

        // 监听用户单独关闭画笔标注配置更新
        rtc.on('allowDrawClose', function (data) {
            console.log(data, '用户单独关闭画笔标注配置更新回调数据');
            popToReminder('用户单独关闭画笔标注配置更新回调数据');
        });

        // 监听用户单独打开画笔标注配置更新
        rtc.on('allowDrawOpen', function (data) {
            console.log(data, '用户单独打开画笔标注配置更新回调数据');
            popToReminder('用户单独打开画笔标注配置更新回调数据');
        });

        // 监听自由连麦摸式下用户关闭举手配置更新
        rtc.on('handUpClose', function (data) {
            console.log(data, '自由连麦摸式下用户单独关闭举手配置更新回调数据');
            popToReminder('自由连麦摸式下用户单独关闭举手配置更新回调数据');
        });

        // 监听自由连麦摸式下用户打开举手配置更新
        rtc.on('handUpOpen', function (data) {
            console.log(data, '自由连麦摸式下用户单独打开举手配置更新回调数据');
            popToReminder('自由连麦摸式下用户单独打开举手配置更新回调数据');
        });

        // 监听用户单独关闭授权为讲师配置更新
        rtc.on('allowAssistantClose', function (data) {
            console.log(data, '用户单独关闭授权为讲师配置更新回调数据');
            popToReminder('用户单独关闭授权为讲师配置更新回调数据');
        });

        // 监听用户单独开启授权为讲师配置更新
        rtc.on('allowAssistantOpen', function (data) {
            console.log(data, '用户单独开启授权为讲师配置更新回调数据');
            popToReminder('用户单独开启授权为讲师配置更新回调数据');

        });

        // 监听聊天发送的信息
        rtc.on('chat_message', function (data) {
            console.log(data, 'listen the chat send message!');
            data = JSON.parse(data);

            // add chat about some props
            var timeMessage = timeNowGet();
            var emoji = chatModel.handleResolverEmoji(data.msg);
            console.log(rtc.viewerid, common.userid, 'user login id compare');

            if (true) {
                var strMsg = '<div class="emoji-message">' +
                    emoji +
                    '<span>' +
                    timeMessage +
                    '</span>' +
                    '<span class="message-delete">' +
                    'X' +
                    '</span>'+
                '</div>';
                $('.show-message').append(strMsg);
            }
        });

        // 监听发送图片的事件
        rtc.on('media_chat', function (data) {
            console.log(data, '发送图片的监听回调数据');
            var imgFormaData = JSON.parse(data);
            console.log(imgFormaData, '发送图片接受的数据');
            var msg = JSON.parse(imgFormaData.msg);
            // 缩略图
            msg.content = msg.content.replace('liveclass.oss-cn-beijing.aliyuncs.com', 'liveclass.csslcloud.net').replace('https', 'http');
            var content = msg.content + '?' + 'x-oss-process=image/resize,m_lfit,h_130,w_130';
            var time = timeNowGet();
            if (!msg.type || msg.type != 'img') {
                return;
            }

            var name = imgFormaData.username;
            var imgMsgText = '<img src=" ' + content + '"   data-url=" ' + msg.content + '" />';
            // todo 在渲染聊天内容时, 需要检测 imgFormaData.userid 与rtc.viewerid,
            // todo if (imgFormaData.userid === rtc.viewerid) {  进行渲染 }， 在demo中， 设置为true, 让用户直观效果。
            if (true) {
                var strImg = '<div class="emoji-message">' +
                    imgMsgText +
                    '<span>' +
                    time +
                    '</span>' +
                    '<span class="message-delete">' +
                    'X' +
                    '</span>' +
                '</div>';
                $('.show-message').append(strImg);
            }
        });

        // 监听聊天记录的事件通知
        rtc.on('chatHistoryGet', function (data) {
            console.log(data, '收到聊天记录的通知监听回调');
            console.log(rtc.viewerid, 'viewerid');

            $('.show-message').html('');
            var strMsg = '';
            data.map(function (item, index) {
                // todo 在渲染聊天内容时, 需要检测 item.userId 与rtc.viewerid,
                // todo if (item.userId === rtc.viewerid) {  进行渲染 }， 在demo中， 设置为true, 让用户直观效果。

                if (true) {
                    strMsg =
                        '<div class="emoji-message">' +
                        chatModel.handleResolverEmoji(item.content) +
                        '<span>' +
                        timeNowGet() +
                        '</span>' +
                        '<span class="message-delete">' +
                        'X' +
                        '</span>'
                    '</div>';
                    $('.show-message').append(strMsg);
                }
            });
        });

        rtc.on('login_failed', function (err) {
            // 登录失败
            console.error('登录失败', err);
        });



    }
};


// https://class.csslcloud.net/index/presenter/?roomid=456D6F642FCF4E5A9C33DC5901307461&userid=83F203DAC2468694
console.log('使用此demo前，必须确保你的roomid、userid、passeord、role是可用的');
//初始化, 传入房间id，用户id
common.roomid = '0C06E2CE446A8ABE9C33DC5901307461';
common.userid = '83F203DAC2468694';
common.name = 'bobo' + parseInt(Math.random() * 100);
common.password = '123';//# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
common.role = 0;// 登录角色 0: 教师 ,    1:互动者，   2: 旁听者

common.init();


//页面已存在dom元素
var otherList = document.getElementById('others');
var open_live = document.getElementById('open_live');
var close_live = document.getElementById('close_live');
var creat_stream = document.getElementById('creat_stream');
var publish_stream = document.getElementById('publish_stream');



$(close_live).on('click', function () {
    rtc.stopLive();
});

$(open_live).on('click', function () {
    rtc.startLive();
});


/**
 *  房间配置的相关更新操作
 *  房间配置的监听， 需要房间各配置项的不断更新， 为了模拟这个配置项不断更新， 使用开关思想来进行控制
 */

 /**
 * 房间讲课模板配置的更新demo
 * @type:  templatetype
 * @value:  1, 2, 4, 16
 * @param:  1: 主讲模式  2: 主视频模式  4: 平铺模式 16: 双师模式
 * @function:  roomTemplateTypeChange
 */
 var templateTypeFlag = false;
$('#templateType').on('click', function (data) {
    if (!templateTypeFlag) {
        rtc.roomUpdate({
            'templatetype': 2,
            roomUpdateSuccess: function (data) {
                console.log(data, '房间摸板配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log('房间摸板配置的失败回调');
            }
        });

        templateTypeFlag = true;
    } else {
        rtc.roomUpdate({
            'templatetype': 4,
            roomUpdateSuccess: function (data) {
                console.log('房间模板配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log('房间摸板配置的失败回调');
            }
        });

        templateTypeFlag = false;
    }

});

/**
 * 跟随摸式配置的更新demo
 * @type: is_follow
 * @param: streamid, "";
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */

var isFollowFlag = false;
$('#is_follow').on('click', function () {
    if (!isFollowFlag) {
        rtc.roomUpdate({
            'is_follow': '02FE2A07706834759C33DC5901307462',
            roomUpdateSuccess: function (data) {
                console.log('跟随摸式配置的成功回调')
            },
            roomUpdateFailed: function (data) {
                console.log('跟随摸式配置的失败回调');
            }
        });

        isFollowFlag = true;
    } else {
        rtc.roomUpdate({
            'is_follow': '',
            roomUpdateSuccess: function (data) {
                console.log('跟随摸式配置的成功回调')
            },
            roomUpdateFailed: function (data) {
                console.log('跟随摸式配置的失败回调');
            }
        });

        isFollowFlag = false;
    }

});

/**
 * 连麦模式监听到变化demo
 * @type: classtype
 * @param: 1, 2, 3
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var classtypeFlag = false
$('#classtype').on('click', function () {
   if (!classtypeFlag) {
       rtc.roomUpdate({
           'classtype': 1,
           roomUpdateSuccess: function (data) {
               console.log(data, '连麦摸式配置的成功回调');
           },
           roomUpdateFailed: function (data) {
               console.log(data, '连麦摸式配置的失败回调');
           }
       });

       classtypeFlag = true;
   } else {
       rtc.roomUpdate({
           'classtype': 2,
           roomUpdateSuccess: function (data) {
               console.log(data, '连麦摸式配置的成功回调');
           },
           roomUpdateFailed: function (data) {
               console.log(data, '连麦摸式配置的失败回调');
           }
       });

       classtypeFlag = false;
   }
});

/**
 * 音视频模式监听到变化demo
 * @type: video_mode
 * @param: 1, 2,
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var videoModeFlag = false;
$('#video_mode').on('click', function () {
    if (!videoModeFlag) {
        rtc.roomUpdate({
            'video_mode': 1,
            roomUpdateSuccess: function (data) {
                console.log(data, '音视频模式配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '音视频模式配置的失败回调');
            }
        });

        videoModeFlag = true;
    } else {
        rtc.roomUpdate({
            'video_mode': 2,
            roomUpdateSuccess: function (data) {
                console.log(data, '音视频模式配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '音视频模式配置的失败回调');
            }
        });

        videoModeFlag = false;
    }
});

/**
 * 全体禁言监听到变化demo
 * @type: allow_chat
 * @param: true, false
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var allowChatFlag = false;
$('#allow_chat').on('click', function () {
    if (!allowChatFlag) {
        rtc.roomUpdate({
            'allow_chat': true,
            roomUpdateSuccess: function (data) {
                console.log(data, '全体开言配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '全体开言配置的失败回调');
            }
        });

        allowChatFlag = true;
    } else {
        rtc.roomUpdate({
            'allow_chat': false,
            roomUpdateSuccess: function (data) {
                console.log(data, '全体禁言配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '全体禁言配置的失败回调');
            }
        });

        allowChatFlag = false;
    }

});

/**
 * 全体关闭/打开麦克风监听到变化demo
 * @type: allow_audio
 * @param: true, false
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var allowAudioFlag = false;
$('#allow_audio').on('click', function () {
    if (!allowAudioFlag) {
        rtc.roomUpdate({
            'allow_audio': true,
            roomUpdateSuccess: function (data) {
                console.log(data, '全体打开麦克风配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '全体打开麦克风配置的失败回调');
            }
        });

        allowAudioFlag = true;
    } else {
        rtc.roomUpdate({
            'allow_audio': false,
            roomUpdateSuccess: function (data) {
                console.log(data, '全体关闭麦克风配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '全体关闭麦克风配置的失败回调');
            }
        });

        allowAudioFlag = false;
    }

});
/**
 * 全体下麦/上麦监听到变化demo
 * @type: allow_speak
 * @param: true, false
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var allowSpeakFlag = false;
$('#allow_speak').on('click', function () {
    if (!allowSpeakFlag) {
        rtc.roomUpdate({
            'allow_speak': true,
            roomUpdateSuccess: function (data) {
                console.log(data, '全体上麦配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '全体上麦配置的失败回调');
            }
        });

        allowSpeakFlag = true;
    } else {
        rtc.roomUpdate({
            'allow_speak': false,
            roomUpdateSuccess: function (data) {
                console.log(data, '全体下麦配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '全体下麦配置的失败回调');
            }
        });

        allowSpeakFlag = false;
    }

});
/**
 * 讲师端码率的更新监听的demo
 * @type: publisher_bitrate
 * @param: {Number}
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var publisherBitrateFlag = false;
$('#publisher_bitrate').on('click', function () {
    if (!publisherBitrateFlag) {
        rtc.roomUpdate({
            'publisher_bitrate': 300,
            roomUpdateSuccess: function (data) {
                console.log(data, '讲师端码率配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '讲师端码率配置的失败回调');
            }
        });

        publisherBitrateFlag = true;
    } else {
        rtc.roomUpdate({
            'publisher_bitrate': 200,
            roomUpdateSuccess: function (data) {
                console.log(data, '讲师端码率配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '讲师端码率配置的失败回调');
            }
        });

        publisherBitrateFlag = false;
    }

});
/**
 * 学生端端码率的更新监听的demo
 * @type: talker_bitrate
 * @param: {Number}
 * @function: rtc.roomUpdate(roomOpation)
 * @callbackSuccess: roomUpdateSuccess
 * @callbackFailed: roomUpdateFailed
 */
var talkerBitrateFlag = false;
$('#talker_bitrate').on('click', function () {
    if (!talkerBitrateFlag) {
        rtc.roomUpdate({
            'talker_bitrate': 300,
            roomUpdateSuccess: function (data) {
                console.log(data, '学生端码率配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '学生端码率配置的失败回调');
            }
        });

        talkerBitrateFlag = true;
    } else {
        rtc.roomUpdate({
            'talker_bitrate': 200,
            roomUpdateSuccess: function (data) {
                console.log(data, '学生端码率配置的成功回调');
            },
            roomUpdateFailed: function (data) {
                console.log(data, '学生端码率配置的失败回调');
            }
        });

        talkerBitrateFlag = false;
    }
});


/**
 * 用户列表配置更新相关操作的demo
 *
 */


/**
 * 用户单独禁言配置更新demo
 * @type: allow_chat
 * @param: true, false
 * @function: rtc.switchUserSetting(c, u, v, r)
 *           {
 * 				c: 用户单独配置功能: 参考文档用户列表配置参数表 allow_chat
 * 				u: rtc.viewerid
 * 				v: true, false
 * 				r: role： 被操作的用户对象角色: presenter, talker
 * 			 }
 *
 * @callback: rtc.on('allowChatClose')
 */
$('#user_allow_chat_close').on('click', function () {
    rtc.switchUserSetting('allow_chat', rtc.viewerid, 'false', 'talker');
});

/**
 * 用户单独允许发言配置更新demo
 * 具体参数说明同上
 */
$('#user_allow_chat_open').on('click', function () {
    rtc.switchUserSetting('allow_chat', rtc.viewerid, 'true', 'talker');
});

/**
 * 用户单独关闭音频配置更新demo
 * @type: allow_audio
 * @value: true, false
 * @function: false: allowAudioClose, 关闭自己音频. true: allowAudioOpen, 打开自己音频
 */
$('#user_allow_audio_close').on('click', function () {
    rtc.switchUserSetting('allow_audio', rtc.viewerid, 'false', 'talker');
});


/**
 * 用户单独打开音频配置更新demo
 * @type: allow_audio
 * @value: true, false
 * @function: false: allowAudioClose, 关闭自己音频. true: allowAudioOpen, 打开自己音频
 */
$('#user_allow_audio_open').on('click', function () {
    rtc.switchUserSetting('allow_audio', rtc.viewerid, 'true', 'talker');
});

/**
 * 单独个人关闭视频demo
 * @type: allow_video
 * @value: true, false
 * @function: false: allowVideoClose, 关闭自己视频. true: allowVideoOpen, 打开自己视频
 */
$('#user_allow_video_close').on('click', function () {
    rtc.switchUserSetting('allow_video', rtc.viewerid, 'false', 'talker');
});

/**
 * 单独个人打开视频demo
 * @type: allow_video
 * @value: true, false
 * @function: false: allowVideoClose, 关闭自己视频. true: allowVideoOpen, 打开自己视频
 */
$('#user_allow_video_open').on('click', function () {
    rtc.switchUserSetting('allow_video', rtc.viewerid, 'true', 'talker');
});


/**
 * 单独个人关闭画笔标注权限demo
 * @type: allow_draw
 * @value: true, false
 * @function: false: allowDrawClose, 关闭自己标注功能 true: allowDrawOpen, 开启自己标注功能
 */

$('#user_allow_draw_close').on('click', function () {
    rtc.switchUserSetting('allow_draw', rtc.viewerid, 'false', 'talker');
});

/**
 * 单独个人打开画笔标注权demo
 * @type: allow_draw
 * @value: true, false
 * @function: false: allowDrawClose, 关闭自己标注功能 true: allowDrawOpen, 开启自己标注功能
 */

$('#user_allow_draw_open').on('click', function () {
    rtc.switchUserSetting('allow_draw', rtc.viewerid, 'true', 'talker');
});

/**
 * 自由连麦摸式下关闭举手配置更新demo
 * @type: hand_up
 * @value: true, false
 * @function: false: handUpClose, 在线列表删除举手通知 true: handUpOpen, 在线列表增加举手通知 handUpOwn: 自己连麦的举手状态变化事件通知
 */

$('#user_hand_up_close').on('click', function () {
    rtc.switchUserSetting('hand_up', rtc.viewerid, 'false', 'talker');
});

/**
 * 自由连麦摸式下打开举手配置更新demo
 * @type: hand_up
 * @value: true, false
 * @function: false: handUpClose, 在线列表删除举手通知 true: handUpOpen, 在线列表增加举手通知 handUpOwn: 自己连麦的举手状态变化事件通知
 */

$('#user_hand_up_open').on('click', function () {
    rtc.switchUserSetting('hand_up', rtc.viewerid, 'true', 'talker');
});

/**
 * 设置取消授权讲师权限demo
 * @type: allow_assistant
 * @value: true, false
 * @function: false: allowAssistantClose,取消讲师功能通知 true: allowAssistantOpen, 授权讲师功能通知
 */
$('#user_allow_assistant_close').on('click', function () {
    rtc.switchUserSetting('allow_assistant', rtc.viewerid, 'false', 'talker');
});

/**
 * 设置确定授权讲师权限demo
 * @type: allow_assistant
 * @value: true, false
 * @function: false: allowAssistantClose,取消讲师功能通知 true: allowAssistantOpen, 授权讲师功能通知
 */
$('#user_allow_assistant_open').on('click', function () {
    rtc.switchUserSetting('allow_assistant', rtc.viewerid, 'true', 'talker');
});

/**
 * 聊天， 图文， 表情包功能demo
 *
 */

var chat_img_global = {
    g_object_name_type: 'random_name',
    g_object_name: '',
    g_oos_params: '',
    expire: '',
    g_dirname: '/'
};

var IMG_FILE = {
    FILE: "",
    FileName: ""
};

// 创建聊天对象
var chatModel = {
    // 点击表情包显示出表情包列表功能函数
    handleEmojiListShow: function (faceDom) {
        var strEmoji =
            '<ul class="img-list-box">' +
            '<li>' +
            '<img src="./static/em2/01.png" title="em2-01">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/02.png" title="em2-02">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/03.png" title="em2-03">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/04.png" title="em2-04">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/05.png" title="em2-05">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/06.png" title="em2-06">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/07.png" title="em2-07">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/08.png" title="em2-08">' +
            '</li>' +
            '<li>' +
            '<img src="./static/em2/09.png" title="em2-09">' +
            '</li>' +
            '</ul>';
        $('.' + faceDom).append(strEmoji);
    },

    // 选择图片功能函数
    handleSelectImg: function () {
        // 获取文件对象的相关数据
        var fileData = $('#myFileUpload')[0].files[0];
        // 创建文件数据对象
        var fileObj = new FileReader();
        // 图片加载完成后
        fileObj.onload = function (e) {
            var imgFile = e.target.result;
            console.log(imgFile);
            $(".img-preview").attr('src', imgFile);
        }
    },

    // 设置文档预览和背景遮罩层功能函数
    handleImgPreviewAndHide: function () {
        var hideStr =
            '<div class="img-preview-box">' +
            '<h4>选择图片的预览</h4>' +
            '<div class="img-preview">' +
            '</div>' +
            '<div class="button-img-box">' +
            '<button class="cancel-send-button" type="button">取消</button>' +
            '<button class="sure-send-button" type="button">发送</button>' +
            '</div>' +
            '</div>' +
            '<div class="background-hide-box">' +
            '</div>';
        $(document.body).append(hideStr);
    },
    // 收集要发送的文本，表情包的功能函数
    handleCollectMessage: function (textDom) {
        var msg;
        // 判断表情包和文本
        msg = $('#' + textDom).val();
        if (msg.length >= 300) {
            msg = msg.substr(0, 300);
            $('.input-bar textarea').val(msg);
            alert('超过字数限制');
        }

        if ($.trim(msg) != '') {
            var msgText = '';
            $.each(msg.split(' '), function (i, n) {
                var ur = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

                if (ur.test(n)) {
                    msgText += '[uri_' + n + '] ';
                    console.log(msgText, '发送文本聊天的url');
                } else {
                    msgText += n + ' ';
                    console.log(msgText, '发送文本聊天的内容');
                }
            });
            console.log(msgText, '要发送的聊天信息');

            rtc.sendMsg(msgText);

        } else {
            alert('发送内容不能为空!');
        }

    },

    // 点击选择表情包显示输入框的功能函数
    handleEmojiSelect: function (imgEmojiDom, textDom) {
        var emojiTitle = imgEmojiDom.attr('title');
        console.log(emojiTitle, '选择图片的title');

        var str = "[" + emojiTitle + "]";
        var textStr = $('#' + textDom).val();
        textStr += str;
        return textStr;
    },

    // 解析发过来的表情包文本转化为表情包的功能函数
    handleResolverEmoji: function (str) {
        if (!$.trim(str)) {
            return '';
        }

        str = str.replace(/\</g, '&lt;');
        str = str.replace(/\>/g, '&gt;');
        str = str.replace(/\n/g, '<br/>');
        str = str.replace(/\[em2-([0-9]*)\]/g, '<img src="./static/em2/$1.png" border="0" />');

        var nmsg = '';
        $.each(str.split(' '), function (i, n) {
            n = $.trim(n);
            if (n.indexOf('[uri_') == 0 && n.indexOf(']') == n.length - 1 && n.length > 6) {
                var u = n.substring(5, n.length - 1) + ' ';
                nmsg += '<a target="_blank" style="color: #fff" href="' + u + '">' + u + '</a>' + ' ';
            } else {
                nmsg += n + ' ';
            }
        });

        return nmsg;
    },

    // 发送图片的功能函数
    handleSendImage: function (file, filename) {
        var that = this;
        // 进行调取上传图片的接口
        $.ajax({
            type: "get",
            data: {
                'userid': common.userid,
                'roomid': common.roomid,
                'type': 'chatimg'
            },
            url: "https://" + main_url + "/api/oss/token",
            success: function (data) {
                chat_img_global.g_oos_params = data;
                chat_img_global.expire = chat_img_global.g_oos_params.expire;
                chat_img_global.g_dirname = chat_img_global.g_oos_params.dir + '/';

                var parms = that.handleImgBase(filename);
                that.handleAossUpload(parms, file, sendImg);
            },
            error: function () {
                console.log('请求后台oss api失败');
            }
        });
    },
    // 处理上传图片的格式功能函数
    handleImgBase: function (filename) {
        chat_img_global.g_object_name = chat_img_global.g_dirname;

        if (filename != '') {
            suffix = chat_get_suffix(filename);
            chat_calculate_object_name(filename);
        }

        var new_multipart_params = {
            'key': chat_img_global.g_object_name,
            'host': chat_img_global.g_oos_params.host,
            // 'policy': Base64.encode(g_oos_params.policy),
            'policy': chat_img_global.g_oos_params.policy,
            'OSSAccessKeyId': chat_img_global.g_oos_params.accessid,
            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
            'signature': chat_img_global.g_oos_params.signature,
            'expire': chat_img_global.g_oos_params.expire
        };

        return new_multipart_params;
    },

    // 上传图片到cc
    handleAossUpload: function (param, file, callback) {
        var signature = param.signature;
        var fileFullName = param.host + "/" + param.key;
        var request = new FormData();
        request.append('OSSAccessKeyId', param.OSSAccessKeyId);
        request.append('policy', param.policy);
        request.append('signature', param.signature);
        request.append('key', param.key);
        request.append('success_action_status', '200');
        for (var i in param.metaDatas) {
            request.append(i, param.metaDatas[i]);
        }

        request.append('file', file);
        request.append('submit', "Upload to OSS");

        $.ajax({
            url: param.host,
            data: request,
            processData: false,
            cache: false,
            async: true,
            contentType: false,
            //关键是要设置contentType 为false，不然发出的请求头 没有boundary
            //该参数是让jQuery去判断contentType
            type: "POST",
            success: function (data, status, request) {
                console.log(data);
                console.log(fileFullName);
                if (status === "success") {
                    //todo 设置发送聊天消息！！
                    console.log(('上传文件名: ' + fileFullName));
                    // todo 设置聊天显示
                    callback(fileFullName);
                } else {
                    console.log('图片上传oss失败');
                }
            }
        });
    }

};

//
function chat_get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
};

// 随机文件名
function chat_calculate_object_name(filename) {
    if (chat_img_global.g_object_name_type == 'local_name') {
        chat_img_global.g_object_name += "${filename}"
    } else if (chat_img_global.g_object_name_type == 'random_name') {
        suffix = chat_get_suffix(filename)
        chat_img_global.g_object_name = chat_img_global.g_dirname + chat_random_string(10) + suffix
    }
    return ''
};

// 随机数函数
function chat_random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};


/**
 * 聊天的相关内容操作
 *
 */
$('.face-img-click').click(function (e) {
    e.stopPropagation();
    chatModel.handleEmojiListShow('parent-face-box');
    emojiFlag = false;

});

// 操作表情图片
$(document).on('click', '.img-list-box img', function (e) {
    e.stopPropagation();
    var ImgDom = $(this);
    if (emojiFlag) {
        var messageTextTalk = chatModel.handleEmojiSelect(ImgDom, 'text-area-talk')
        $('#text-area-talk').val(messageTextTalk);
        var messageResolverText = chatModel.handleResolverEmoji(messageTextTalk);
    } else {
        var messageTextParent = chatModel.handleEmojiSelect(ImgDom, 'text-area-parent');
        $('#text-area-parent').val(messageTextParent);
        var messageResolverText = chatModel.handleResolverEmoji(messageTextParent);
    }


    if ($('.img-list-box')) {
        $('.img-list-box').remove();
    }
});

// 点击发送按钮，发送聊天内容的操作
$('#sendMessageParent').click(function (e) {
    e.stopPropagation();
    chatModel.handleCollectMessage('text-area-parent');
    $('#text-area-parent').val('');
});

// 格式化时间的功能函数
function timeNowGet() {
    var time = new Date();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return hour + ":" + minutes + ":" + seconds;
};


var emojiFlag = false,
    fileFlag = false;

// 学生端点击表情包的操作
$('.face-img-click-talk').click(function (e) {
    e.stopPropagation();
    chatModel.handleEmojiListShow('talk-face-box');
    emojiFlag = true;
});


// 学生端的点击发送按钮的操作
$('#sendMessage').click(function (e) {
    e.stopPropagation();
    chatModel.handleCollectMessage('text-area-talk');
    $('#text-area-talk').val('');
});

//  删除信息的方法
$(document).on('click', '.message-delete', function (e) {
    e.stopPropagation();
    $(this).parent().remove();
});

// 上传图片的操作
$('.myFileUpload').on('change', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file_list = "";

    if ($(this).attr("id") === "fileUpload") {
        file_list = $("#fileUpload")[0].files;
        fileFlag = true;
    } else {
        file_list = $(".myFileUpload")[0].files;
        fileFlag = false;
    }

    console.log(file_list, '选择的图片名');

    if (file_list.length == 0) {
        alert('请选择文件');
        return;
    }

    var file = file_list[0];

    if (!/^image*/.test(file.type)) {
        alert('仅支持上传图片');
        return;
    }

    IMG_FILE.FILE = file;
    IMG_FILE.FileName = file.name;

    var innerhtml = '<img style="max-width: 100%;" src="' + window.URL.createObjectURL(file) + ' " alt="img">';
    console.log(innerhtml, '上传图片的显示');
    chatModel.handleImgPreviewAndHide();
    $('.img-preview').append(innerhtml);
});

// 成功回调后，发送图片事件通知
function sendImg(data) {

    var msg = {
        'type': 'img',
        'content': data
    };
    console.log('!!!!!!!!上传文件路径' + data);
    rtc.sendImg(JSON.stringify(msg));
    $('.img-preview-box').remove();
    $('.background-hide-box').remove();
};

// 点击发送按钮图片的操作
$(document).on('click', '.sure-send-button', function (e) {
    e.stopPropagation();
    $('#text-area-parent').val('').focus();
    var file = IMG_FILE.FILE;

    var filename = IMG_FILE.FileName;

    if (file && filename) {
        chatModel.handleSendImage(file, filename);
        if (fileFlag) {
            $("#myFileUpload").val(null);
        } else {
            $(".myFileUpload").val(null);
        }

        IMG_FILE.FILE = "";
        IMG_FILE.FileName = "";
    }
});

//  创建自定义弹框提示
function popToReminder(text, color) {
    var popStr =
        '<div class="pop-box" style="background-color:' + color + '">' +
        '<p>' +
        text +
        '</p>' +
        '</div>';
    $(document.body).append(popStr);
    setTimeout(function () {
        $('.pop-box').fadeOut();
        setTimeout(function () {
            $('.pop-box').remove();
        }, 100);
    }, 1500);
};
