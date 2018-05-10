/**
 * Created by Administrator on 2017/11/16.
 */
var common = {
    roomid: '',
    userid: '',
    localStream: null,
    is_publish: 0, //房间是否是直播状态 ,老师开始直播1，未开始直播0，此事件需你们自定义
    init: function(){
        var _this = this;
        $.ajax({
            url: "https://ccapi.csslcloud.net/api/room/auth",
            type: "GET",
            dataType: "json",
            data: {
                userid: _this.userid,
                roomid: _this.roomid,
                name: _this.name,
                password: _this.password,//# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
                role: _this.role, // 登录角色 0: 教师 ,    1:互动者，   2: 旁听者
                client: "0" //登录客户端类型：0: 浏览器， 1: 移动端 （必填）
            },
            success: function (data) {
                console.log(data);
                if(data.result === 'OK'){
                    var data = data.data;
                    var sessionid = data.sessionid;

                    console.log(sessionid);
                    common.login(sessionid);



                }else{
                    alert('登录接口验证失败');
                }
            }
        });
    },

    login: function(sessionid){
        //初始化
        rtc = new Exrtc({
            userid: this.userid, // 用户ID
            sessionid: sessionid
        });

        rtc.on('login_success', function (data) {
            // 登录成功
            console.log(data);
        });

        rtc.on('login_failed', function (data) {
            // 登录失败
            console.log('登录失败');
        });

        rtc.on('conference_join', function (streams) {
        	//创建本地流
        	rtc.createLocalStream(null, null, function(flag, value){
	            if(flag){
	                rtc.emit("local_stream_created", value);
	            }else{
	                rtc.emit("local_stream_create_failed", value);
	            }
	        });
            console.log('加入房间');
            //老师调开始直播接口
         
        });

        rtc.on('conference_join_failed', function (err) {
            // 加入房间失败
            console.log('加入房间失败',err);
        });

        rtc.on('local_stream_created', function (stream) {
            // 本地流创建成功  elementId为视频盒子id
            common.localStream = stream;
            console.log('本地流创建成功');
            stream.show('my'); // 显示流
            //先不要推流
            
            rtc.getLiveStat(function(flag, value){
			    if(flag){
			        rtc.publish(200, function(f, v){
					    if(f){
					        console.log('本地流推送成功', v.id());
					        rtc.emit('local_stream_published', v.id());
					    }else{
					        console.log(v);
					        rtc.emit('local_stream_publish_failed');
					    }
					});
			    }else{
			    	rtc.startLive();
			    }
			});

        });

        rtc.on('local_stream_create_failed', function (err) {
            // 本地流创建失败
            console.log('本地流创建失败', err);
        });

        rtc.on('local_stream_published', function (streamid) {
            // 本地流推送成功
            console.log('本地流推送成功', streamid);
            //上麦结果更新
            rtc.updateMcResult(1, streamid);
            //cdn推流
            rtc.addExternalOutput();
            
        });

        rtc.on('local_stream_publish_failed', function (stream) {
            // 本地流推送失败
            console.log('本地流推送失败', stream);
            rtc.updateMcResult(0);
        });
        
		//可以订阅流
	    rtc.on('allow_sub', function (stream) {
	        rtc.subscribeStream(stream);
	    });
	    
	    // 取消订阅
	    rtc.on('unSub', function (stream) {
	        rtc.unSubscribe(stream);
	    });

        rtc.on('stream_removed', function (id) {
            // 删除流
            console.log('stream_removed', id);
            var eid = document.getElementById(id);
            if(eid){
                otherList.removeChild(eid);
            }

        });

        rtc.on('stream_subscribed', function (stream) {
            // 订阅流成功
            var streamId = stream.id(); // 获取流id
            console.log('订阅流成功', streamId);

            //将视频动态插入盒子中
            var li = document.createElement('li');
            li.setAttribute('id', streamId);
            otherList.appendChild(li);
            stream.show(streamId);
		    
        });

        rtc.on('stream_subscribed_failed', function (err) {
            // 订阅流失败
            console.log('订阅流失败', err);
        });
        
       //监听到开始直播
        rtc.on('publish_stream', function (str) {
        	//推流
            rtc.publish(200, function(f, v){
			    if(f){
			        console.log('本地流推送成功', v.id());
			        rtc.emit('local_stream_published', v.id());
			    }else{
			        console.log(v);
			        rtc.emit('local_stream_publish_failed');
			    }
			});
            
        });

        //监听到结束直播
        rtc.on('end_stream', function (str) {
        // 关闭直播间成功，需改变直播间状态
            rtc.unPublish(function(flag, value){
			    if(flag){
			        console.log('停止推送本地流成功',value);
			    }else{
			        console.log(value);
			    }
			});
			//断开cdn推流
			rtc.removeExternal();
        });

		

        //房间人员状态更新
        rtc.on('online_users', function (data) {
            //Speaker.onlineUsers为房间用户最新状态列表
            console.log(Speaker.onlineUsers);
            //Speaker.onlineUsers   与     data   是一样的
            console.log('online_users-------', data);
            userList.innerHTML = '';
            for (var i = 0; i < data.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = data[i].name;
                userList.appendChild(li);
            }

        });
       



        //收到聊天
        rtc.on('chat_message', function (msg) {
            var msgUl = document.getElementById('msg-ul'),
                li = document.createElement('li'),
                oMsg = JSON.parse(msg);
            console.log('收到聊天消息', oMsg);
            li.innerHTML = oMsg.username + ': ' + oMsg.msg;
            msgUl.appendChild(li);
        });

   
        // socket重连成功
        rtc.on('reconnect_user', function(){
            console.log('socket重连成功');
        });

        // socket重连成功断开连接
        rtc.on('disconnect_user',function(){
            console.log('socket断开连接');
        });

    }
}





//初始化	，传入房间id，用户id
common.roomid = 'AAC8685B3F08EE079C33DC5901307461';
common.userid = '41E8063FC799ACE5';
common.name = 'teacher';
common.password ='111';//# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
common.role = 0;// 登录角色 0: 教师 ,    1:互动者，   2: 旁听者
//定义sdk初始化变量
var rtc = null;
common.init();







//页面已存在dom元素
var otherList = document.getElementById('others'),
    myVideo = document.getElementById('my'),
    sendBtn = document.getElementById('btn-send'),
    userList = document.getElementById('user-list'),
    teacher_publish = document.getElementById('teacher_publish');
   


//发送聊天
sendBtn.onclick = function () {
    var msg = document.getElementById('msg');
    rtc.sendMsg(msg.value);
    msg.value = '';
};

//老师点击开始直播退本地流，并向学生发事件告诉学生可以订阅其他人流







