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

	login: function(sessionid) {
		//初始化
		rtc = new Rtc({
			userid: this.userid, // 用户ID
			sessionid: sessionid
		});

		rtc.on('login_success', function(data) {
			// 登录成功
			console.log(data, 'login_success');
			consoleText('登录成功');

		});

		rtc.on('login_failed', function(err) {
			// 登录失败
			console.error('登录失败', err);
			consoleText('登录失败','error');
			
		});

		rtc.on('conference_join', function(streams) {
			//进入房间成功
			console.log('conference_join', streams);

			rtc.getLiveStat({ //查看直播开启状态
				success: function(data) {
					consoleText('直播已开启')
					
				},
				fail: function(str) {
					consoleText(str,'error');
				}
			});

		});

		//监听到开始直播
		rtc.on('publish_stream', function(str) {
			//直播间调开始直播成功，需更改直播间状态         
			

		});

		rtc.on('conference_join_failed', function(err) {
			// 加入房间失败
			console.log('加入房间失败', err);
		});

		rtc.on('stream_removed', function(stream) {
			// 删除流

			$('#' + stream.id()).remove();

		});
		//创建本地流
		rtc.on('createLocalStream', function() {

			rtc.createLocalStream({
				streamName: 'main',
				success: function(stream) {
					consoleText('main：本地流创建成功');
					stream.show('my_1'); // 将本地流显示在元素id值为id的盒子中	
					rtc.publish({
						streamName: 'main',
						videoRate: 300,
						audioRate: 50,
						success: function(stream) {
							consoleText('main：本地流推送成功'); // 将本地流显示在元素id值为id的盒子中
							rtc.updateMcResult({
								pid:1,
								stid:stream.id(),
								success: function(id) {
									console.log('上麦结果更新成功', id);
								},
								fail: function(err) {
									console.log('上麦结果更新失败', err);
								}
							});
						},
						fail: function(str) {
							consoleText(str,'error');
						}
					});
				},
				fail: function(str) {
					consoleText(str, 'error');
				}
			});
			rtc.createLocalStream({
				streamName: 'assist',
				success: function(stream) {
					consoleText('assist：本地流创建成功');
					stream.show('my_2'); // 将本地流显示在元素id值为id的盒子中	
					rtc.publish({
						streamName: 'assist',
						videoRate: 300,
						audioRate: 50,
						success: function(stream) {
							consoleText('assist：本地流推送成功'); // 将本地流显示在元素id值为id的盒子中
							rtc.updateMcResult({
								pid:1,
								stid:stream.id(),
								success: function(id) {
									console.log('上麦结果更新成功', id);
								},
								fail: function(err) {
									console.log('上麦结果更新失败', err);
								}
							});
						},
						fail: function(str) {
							consoleText(str,'error');
						}
					});
				},
				fail: function(str) {
					consoleText(str, 'error');
				}
			});
		});
		// 下麦
		rtc.on('mcDown', function() {
			consoleText('下麦成功');

			rtc.closeVideo({
				streamName: 'main',
				success: function() {
					consoleText('main：关闭本地流成功');
				},
				fail: function(str) {
					consoleText(str, 'error');
				}
			});
			rtc.closeVideo({
				streamName: 'assist',
				success: function() {
					consoleText('assist：关闭本地流成功');
				},
				fail: function(str) {
					consoleText(str, 'error');
				}
			});

		});
		
		rtc.on('allow_sub', function(stream) {
			// 订阅流
			console.log('stream_added', stream);

			if(stream instanceof Woogeen.RemoteMixedStream) {
				console.log('是混合流,不定阅');

			} else {
				rtc.trySubscribeStream({
					tryStream: stream,
					success: function(stream) {
						var streamId = stream.id(); // 获取流id
						consoleText('订阅流成功');

						//将视频动态插入盒子中
						var li = document.createElement('li');
						li.setAttribute('id', streamId);
						otherList.appendChild(li);
						stream.show(streamId);
					},
					fail: function(err) {
						consoleText(err, 'error');
					}
				});
			}

		});

		rtc.on('server_disconnected', function(stream) {
			// 订阅流
			otherList.innerHTML = '';

		});

		rtc.on('unSub', function(stream) {
			rtc.unSubscribeStream({
				unSubStream: stream,
				success: function(id) {
					consoleText('取消订阅成功');
				},
				fail: function(err) {
					consoleText(err, 'error');
				}
			})
		});

		//房间人员状态更新
		var firstJoin = true;//是否为第一次进入房间
		rtc.on('online_users', function(data) {
			console.log(data, '---------------------------');
			var uid = rtc.viewerid; //获取用户id
			userList.innerHTML = '<li><span>用户名</span><span>状态</span></li>';
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = '<span>' + data[i].name + '</span><span>' + data[i].status + '</span>';
				userList.appendChild(li);

				if(data[i].id == uid) { //确定当前用户状态，返回出去
					thisType = data[i].status;
					if(firstJoin&&data[i].status==3){
						rtc.createLocalStream({
							streamName: 'main',
							success: function(stream) {
								consoleText('main：本地流创建成功');
								stream.show('my_1'); // 将本地流显示在元素id值为id的盒子中	
								rtc.publish({
									streamName: 'main',
									videoRate: 300,
									audioRate: 50,
									success: function(stream) {
										consoleText('main：本地流推送成功'); // 将本地流显示在元素id值为id的盒子中
										rtc.updateMcResult({
											pid:1,
											stid:stream.id(),
											success: function(id) {
												console.log('上麦结果更新成功', id);
											},
											fail: function(err) {
												console.log('上麦结果更新失败', err);
											}
										});
									},
									fail: function(str) {
										consoleText(str,'error');
									}
								});
							},
							fail: function(str) {
								consoleText(str, 'error');
							}
						});
						
						rtc.createLocalStream({
							streamName: 'assist',
							success: function(stream) {
								consoleText('assist：本地流创建成功');
								stream.show('my_2'); // 将本地流显示在元素id值为id的盒子中	
								rtc.publish({
									streamName: 'assist',
									videoRate: 300,
									audioRate: 50,
									success: function(stream) {
										consoleText('assist：本地流推送成功'); // 将本地流显示在元素id值为id的盒子中
										rtc.updateMcResult({
											pid:1,
											stid:stream.id(),
											success: function(id) {
												console.log('上麦结果更新成功', id);
											},
											fail: function(err) {
												console.log('上麦结果更新失败', err);
											}
										});
									},
									fail: function(str) {
										consoleText(str,'error');
									}
								});
							},
							fail: function(str) {
								consoleText(str, 'error');
							}
						});
					}
				};

			};
			firstJoin=false;
			clickbuttonTEXT();
		});
		
		rtc.on('stream_removed', function (id) {
            // 删除流
            console.log('stream_removed', id);
            var eid = document.getElementById(id);
            if(eid){
                otherList.removeChild(eid);
            }

        });
	}
};

//https://class.csslcloud.net/index/presenter/?roomid=F0EA8147316CC30B9C33DC5901307461&userid=83F203DAC2468694
console.log('使用此demo前，必须确保你的roomid、userid、passeord、role是可用的');
//初始化	，传入房间id，用户id
common.roomid = 'F0EA8147316CC30B9C33DC5901307461';
common.userid = '83F203DAC2468694';

common.name = 'student' + parseInt(Math.random() * 100);
common.password = '123'; //# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
common.role = 1; // 登录角色 0: 教师 ,    1:互动者，   2: 旁听者

common.init();

//页面已存在dom元素
var otherList = document.getElementById('others');
var userList = document.getElementById('user-list');

var thisType = -1;

$("#clickbutton").click(function() {
	if(thisType == 0) {
		rtc.handsUp({
			success: function(data){
		        console.log(data);
		    },
		    fail: function(err){
		        console.log(str);
		    }
		}); //举手
	} else if(thisType == 1) {

	} else if(thisType == 2) {

	} else if(thisType == 3) {
		var uid = rtc.viewerid; //获取用户id
		rtc.handsDown({//下麦
			uid: uid,
		    success: function(str){
		        console.log('请求成功');
		    },
		    fail: function(str){
		        console.log('请求失败');
		    }
		}); 
	} else if(thisType == 4) {

	}

})

function clickbuttonTEXT() {
	
	var str = '',
		butval = '';
	if(thisType == 0) {
		str = "点击举手按钮，用户举手申请连麦";
		butval = '举手';
	} else if(thisType == 1) {
		str = "排麦中，点击按钮，可以取消排麦";
		butval = '排麦中';
	} else if(thisType == 2) {
		str = "连麦中，点击按钮，可以取消连麦";
		butval = '连麦中';
	} else if(thisType == 3) {
		str = "连麦成功，点击按钮，可以下麦";
		butval = '下麦';
	} else if(thisType == 4) {
		str = "同意";
        str = "同意上麦";
	}

	$("#clickbutton-p").html(str);
	$('#clickbutton').html(butval);
}

function consoleText(text, err) {
	var color = err ? 'red' : '#000';
	var str = '<p style="color:' + color + '">' + text + '</p>';
	$("#consoletext").append(str);
};