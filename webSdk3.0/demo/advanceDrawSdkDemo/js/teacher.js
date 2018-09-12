/**
 * 存储复用sessionid
 */

// 设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/";
    console.log(d)
}

// 读取cookies
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
            url: "https://" + main_url + "/api/room/auth",
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
        // 初始化基础sdk
        // 同一个sessionid代表相同用户，
        // 可以将拿到的sessionid做浏览器存储，刷新后从本地获取sessionid，直接初始化sdk

        window.rtc = new Rtc({
            userid: this.userid, // 用户ID
            sessionid: sessionid
        });




        // 监听登陆成功
        rtc.on('login_success', function (data) {
            // 登录成功
            console.log(data,'login_success');

            var canvasInitData = {
                allowDraw: true,
                id: 'draw-parent',
                pptDisplay: 0,   // 默认0，按窗口  1， 按宽度
            };

            if(data.live.status === 1){
                canvasInitData.liveId = data.live.id;
            }

            // 初始化画板
            rtc.canvasInit(canvasInitData);

            // 讲师端获取所有已上传文档
            // 获取房间内所有文档


            // 获取机构文档库所有关联文档
            rtc.getInstructionAllDocument({
                getInstructionAllDocumentSuccess: docShow.get_instruction_Docs,
                getInstructionAllDocumentFailed: docShow.getInstructionFailed
            })

        });


        // 监听登陆失败
        rtc.on('login_failed', function (err) {
            // 登录失败
            console.error('登录失败',err);
        });

        // 监听sdk内文档状态通知变化
        rtc.on('flipMessage', function(data){
            if(data.action === 'changeDoc'){
                changeDocMessage.changeDoc(data.data);
                console.log(data.data, '=========');
            }else if(data.action === 'flip'){
                changeDocMessage.flip(data.data);
            }else if(data.action === 'scale'){
                changeDocMessage.scale(data.data);
                console.log(data.data, '----------');
            }else if(data.action === 'history'){
                changeDocMessage.history(data.data);
            }
        });





    }
};


console.log('使用此demo前，必须确保你的roomid、userid、password、role是可用的');
//初始化	，传入房间id，用户id, name, 角色，
common.roomid = '9200D3D4157EB95B9C33DC5901307461';
common.userid = '41E8063FC799ACE5';
common.name = 'teacher'+ parseInt(Math.random()*100) ;
common.password ='111';//# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
common.role = 0;// 登录角色 0: 教师 ,1:互动者,  2:旁听者   教师角色一个房间只能有一人登陆，其他角色不限制



//获取 sessionid 初始化基础sdk, 同一个sessionid代表相同用户，
// 可以将拿到的sessionid做浏览器存储，刷新后从本地获取sessionid，直接初始化sdk
common.init();









