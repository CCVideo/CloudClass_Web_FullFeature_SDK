!function(e,t,a){function r(e){this.mode=e.mode||0,this.filesObject=e.files,this.uploadCallbackBefore=e.uploadCallbackBefore,this.uploadCallbackSuccess=e.uploadCallbackSuccess,this.uploadCallbackFailed=e.uploadCallbackFailed,this.init()}function o(e){for(var t=parseInt(e,10).toString(16).toUpperCase(),a=t.length,i=0;i<6-a;i++)t="0"+t;return"#"+t}function n(e){return"string"==typeof e&&(e=JSON.parse(e)),e}function s(e){return"#"===e.url&&"WhiteBorad"===e.fileName}function d(){var i,r,o;a(t).on("mousedown","#drag_input",function(a){_event=a||e.event,target=t.getElementById("drag_input"),r=_event.clientX-target.offsetLeft,o=_event.clientY-target.offsetTop,i=target}),t.onmousemove=function(a){if(i){_event=a||e.event;var n=_event.clientX-r,s=_event.clientY-o;draw_box=t.getElementById("draw-box"),n<0&&(n=0),n>draw_box.offsetWidth-i.offsetWidth&&(n=draw_box.offsetWidth-i.offsetWidth),s<0&&(s=0),s>draw_box.offsetHeight-i.offsetHeight&&(s=draw_box.offsetHeight-i.offsetHeight);var d=t.getElementById("drag_input");d.style.left=n+"px",d.style.top=s+"px"}},t.onmouseup=function(e){i=null}}var c,h,l,u,p,g;Rtc.prototype.canvasInit=function(e){c=this;var t=e.allowDraw;h=e.id,e.liveId&&(u=e.liveId,P.getBoard()),g=e.pptDisplay?1:0;if(a("#"+h).append('<div id="draw-box"><div id="draw"><canvas id="draw-board"></canvas><iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" allow="autoplay"></iframe><div class="fluo-dis fluo-con" id="DOMfluorescence"><div class="backg-c"></div></div><div class="fluo-dis fluo-ear" id="DOMerasureBack"><div class="backg-c"></div></div></div></div>'),v.load(),DP=new y,DP.init(t),l=new Dpc,c.on("publish_stream",function(){c.startTime=(new Date).getTime(),DP.clearCache(),t&&m.flip()}),c.on("end_stream",function(){DP.clearCache(),u=""}),c.on("page_change",function(e){var a=JSON.parse(e);m.current_animation=0,a.value.url=a.value.url.replace("http:","https:"),t||DP.flip(JSON.stringify(a.value))}),c.on("animation_change",function(e){var e=JSON.parse(e);m.current_animation=e.value.step;var a={id:e.value.docid,s:e.value.step,n:e.value.page};t||DP.do_animation(a)}),c.on("live_start",function(e){u=e.liveId}),!u){var i={action:"history",data:{name:m.name,id:m.id}};c.emit("flipMessage",i)}c.jsonp({url:"https://view.csslcloud.net/api/view/info",callbackName:"callback",time:"30000",data:{roomid:c.roomid,userid:c.userid},success:function(e){if(e.success){console.log("历史记录--------",e);var a=e.datas.meta.pageChange,i=e.datas.meta.animation,r=i.pop();if(a&&a.length){a.sort(function(e,t){return parseInt(e.time)-parseInt(t.time)});var o=a.pop();m.name=o.docName,m.totalpage=o.docTotalPage,m.id=o.encryptDocId,m.useSDK=!1,m.relativePage=Number(o.pageTitle);var n=o.pageNum;"WhiteBorad"===m.name&&(n=m.relativePage);var s=o.url.replace("http:","https:");setTimeout(function(){if(t){var a={action:"history",data:{name:m.name,id:m.id}};c.emit("flipMessage",a),setTimeout(function(){"WhiteBorad"===m.name?m.slideTo(Number(n)):m.slideTo(Number(n)+1)},1e3)}else DP.flip(JSON.stringify({fileName:o.docName,totalPage:o.docTotalPage,docid:o.encryptDocId,url:s,page:o.pageNum,useSDK:!1,mode:o.mode,relativePage:m.relativePage}));if(i.length&&o.time<r.time){var d=r.step,h={id:r.docId,s:d,n:r.pageNum};setTimeout(function(){DP.do_animation(h),t&&c.do_animation(h)},2e3)}setTimeout(function(){var t=e.datas.meta.draw;if(t&&t.length)for(var a=0;a<t.length;a++){var i=t[a];12!=JSON.parse(i.data).type&&DP.draw(i.data)}},2e3)},2e3)}}else console.log("初始化文档失败:"+e.msg)}})},Rtc.prototype.getSingleDocument=function(e){w.getSingleDocument(this,e)},Rtc.prototype.getInstructionAllDocument=function(e){w.getInstructionAllDocument(this,e)},Rtc.prototype.cancelDocument=function(e){w.cancelDocument(this,e)},Rtc.prototype.drawChange=function(e){b.drawChange(this,e)},Rtc.prototype.docChange=function(e){b.docChange(this,e)},r.prototype={constructor:r,init:function(){try{if(null==this.filesObject)throw new ReferenceError("upload the file is not exist, place choose upload the file, again to upload the file");if("function"!=typeof this.uploadCallbackSuccess)throw new TypeError("Assert uploadCallbackSuccess is not function. you need to typeof uploadCallbackSuccess is function.");if("function"!=typeof this.uploadCallbackFailed)throw new TypeError("Assert uploadCallbackFailed is not function. you need to typeof uploadCallbackSuccess is function.");if("function"!=typeof this.uploadCallbackBefore)throw new TypeError("Assert uploadCallbackBefore is not function. you need to typeof uploadCallbackBefore is function.")}catch(e){return"function"==typeof this.uploadCallbackFailed?this.uploadCallbackFailed(e):alert(e),null}var e=0;if(e=this.filesObject.size>1048576?(Math.round(100*this.filesObject.size/1048576)/100).toString()+"MB":(Math.round(100*this.filesObject.size/1024)/100).toString()+"KB",this.fileSize=e,this.fileType=this.filesObject.type,this.fileName=this.filesObject.name,this.AssertFilesType())return this.uploadCallbackFailed("Assert upload file type is not support, place change the file type, again upload the file!"),null;this.getUpLoadUrl(this.filesObject.size,this.fileName)},getUpLoadUrl:function(e,t){var i=this,r=this.mode;a.get("https://"+main_url+"/api/v1/serve/doc/add",{account_id:c.userid,doc_name:t,doc_size:e,room_id:c.roomid,allow_animation:r},function(e){console.log(e,"-------------------"),"OK"===e.result?(i.url=e.data.upload_url,i.uploadFile()):("function"==typeof i.uploadCallbackFailed&&i.uploadCallbackFailed("get upload url err"),console.log(e))})},uploadFile:function(){var e=new FormData,t=this.url;e.append("file",this.filesObject);var i=Date.parse(new Date),r=this;a.ajax({type:"post",url:t,async:!0,contentType:!1,processData:!1,data:e,dataType:"text",beforeSend:function(e){r.uploadCallbackBefore(i)},success:function(e){!0!==(e=JSON.parse(e)).success?r.uploadCallbackFailed(e,i):r.uploadCallbackSuccess(e,i)},error:function(e,t,a,i){r.uploadCallbackFailed(a)}})},AssertFilesType:function(){var e=[".doc",".docx",".ppt",".pptx",".pdf",".jpg"],t=this.fileName.split("."),a="."+t[t.length-1];return this.fileExtension=a,-1===e.indexOf(this.fileExtension)}};var w={getSingleDocument:function(e,t){if(!e||!t||!t.docId)return null;a.ajax({url:"https://ccapi.csslcloud.net/api/v1/serve/doc/auth/list",type:"GET",dataType:"json",data:{account_id:e.userid,room_id:e.roomid,doc_id:t.docId},success:function(e){"function"==typeof t.getSingleDocumentCallback&&t.getSingleDocumentCallback(e,t.docId)}})},getInstructionAllDocument:function(e,t){if(!e||!t)return null;a.ajax({url:"https://ccapi.csslcloud.net/api/doc/auth/list",type:"GET",dataType:"json",data:{room_id:e.roomid,account_id:e.userid,is_migrate:1},success:function(e){"OK"===e.result?"function"==typeof t.getInstructionAllDocumentSuccess&&t.getInstructionAllDocumentSuccess(e):"function"==typeof t.getInstructionAllDocumentFailed&&t.getInstructionAllDocumentFailed(e)}})},cancelDocument:function(e,t){if(!e||!t||!t.docId)return null;a.ajax({url:"https://ccapi.csslcloud.net/api/doc/unrelate",type:"POST",dataType:"json",data:{room_id:e.roomid,doc_id:t.docId},success:function(e){"OK"===e.result?"function"==typeof t.cancelDocumentSuccess&&t.cancelDocumentSuccess(e,t.docId):"function"==typeof t.cancelDocumentFailed&&t.cancelDocumentFailed(e,t.docId)}})}},f={preType:2,alpha:1,color:"0",docid:"WhiteBorad",width:a("#draw").width(),height:a("#draw").height(),page:0,thickness:1,type:2,fontSize:15,draw:"",mode:0,useSDK:!1,name:"WhiteBorad",viewername:"",viewerid:"",drawid:""},m={name:"WhiteBorad",id:"WhiteBorad",totalpage:1,domain:"//image.csslcloud.net",useSDK:!1,docFromRoomId:"",currentPage:0,url:"#",mode:0,useSDK:!1,whiteArr:[0],whiteNum:0,relativePage:1,animation_count:0,current_animation:0,slideTo:function(e){var e=parseInt(e);"WhiteBorad"===m.name?(f.page=this.currentPage=this.whiteArr[e-1],this.relativePage=e):f.page=this.currentPage=e-1,this.flip()},prePage:function(){if("WhiteBorad"===this.name){if(1===this.relativePage)return;this.relativePage=this.relativePage-1,this.currentPage=this.whiteArr[this.relativePage-1],this.flip()}else 0==this.currentPage?this.currentPage=0:(this.currentPage--,this.flip())},nextPage:function(){if("WhiteBorad"===this.name){if(this.relativePage===this.totalpage)return;this.relativePage=this.relativePage+1,this.currentPage=this.whiteArr[this.relativePage-1],this.flip(this.pic_domain)}else this.currentPage<Number(this.totalpage-1)&&(this.currentPage++,this.flip())},flip:function(){var e={n:this.name,id:this.id,t:parseInt(this.totalpage),u:"",p:this.currentPage,useSDK:this.useSDK,mode:this.mode};if("WhiteBorad"===this.name){e.u="#";var t=this.whiteArr.indexOf(m.currentPage);e.r=t+1,m.relativePage=e.r}else{if(!this.domain||!this.docFromRoomId||!e.id)return void console.log("域名："+this.domain,"roomid:"+e.docFromRoomId,"doc.id:"+e.id,"数据出错");e.u=this.domain+"/image/"+this.docFromRoomId+"/"+e.id+"/"+e.p+".jpg"}DP.flip(JSON.stringify({fileName:e.n,totalPage:e.t,docid:e.id,url:e.u,page:e.p,useSDK:e.useSDK,mode:e.mode,relativePage:e.r})),e.w=DP.tp_w,e.h=DP.tp_h,"#"!==e.u&&(e.u="http:"+e.u),c.flip(e),m.current_animation=0},do_animation:function(e){e&&(m.current_animation=e);var t={id:m.id,s:m.current_animation,n:m.currentPage};DP.do_animation(t),c.do_animation(t)}},v={allow_draw:!0,dp:a("#draw-board"),setting:function(){this.$=function(e){return"string"==typeof e?t.getElementById(e):e},this.canvas=this.$("draw")},load:function(){this.x=[],this.y=[],this.lock=!1,this.setting(),this.touch=!1,this.DOMfluorescence=this.$("DOMfluorescence"),this.DOMerasureBack=this.$("DOMerasureBack"),this.StartEvent=this.touch?"touchstart":"mousedown",this.MoveEvent=this.touch?"touchmove":"mousemove",this.EndEvent=this.touch?"touchend":"mouseup",this.StartOver=this.touch?"touchstart":"mouseover",this.MoveOut=this.touch?"touchend":"mouseout",this.bind()},bind:function(){var e=this;e.clk=0,a(t).on("click","#draw-board",function(t){if(e.allow_draw){if(5!=f.type)return;if(a("#drag_input").length>0){var i=a(".textInput"),r=i.html().replace(/<div>/g,"\n").replace(/<\/div>/g,"").replace(/\\<br>/g,"").replace(/&nbsp;/g,"").replace(/<br>/g,""),n=(i.offset().left-a(this).offset().left)/a(this).attr("width"),s=(i.offset().top-a(this).offset().top)/a(this).attr("height");f.draw={x:n,y:s,label:r,width:i.width()*DP.tp_w/a(this).attr("width"),height:i.height()*DP.tp_h/a(this).attr("height"),width_per:i.width()/a(this).attr("width"),height_per:i.height()/a(this).attr("height"),size:f.fontSize};var d=f.page,h=f.name;f.width=a("#draw").width(),f.height=a("#draw").height(),f.drawid=c.viewerid+(new Date).getTime(),f.viewername=c.name,f.viewerid=c.viewerid;var l=JSON.stringify(f),u=JSON.parse(l);a.trim(r)&&(DP.draw(u,!1),c.draw(h,d,u)),i.remove(),e.clk=0,f.draw=""}else{if(e.clk=!e.clk,e.clk){var p=parseInt(f.fontSize),g=parseInt(p*a("#draw-board").width()/DP.tp_w);a("body #draw").append('<div id="drag_input" class="textInput" contenteditable="true"></div>'),a(".textInput").css({position:"absolute",display:"inline-block",top:t.offsetY,left:t.offsetX,"text-align":"left","z-index":"999999",color:o(f.color),"min-width":"10px","max-width":"100%",background:"#fff",border:"1px solid gray","font-size":g+"pt",cursor:"move"}).focus()}else a(".textInput").remove()}}}),this.canvas["on"+e.StartOver]=function(t){var i=e.touch?t.touches[0]:t;f.width=a("#draw").width(),f.height=a("#draw").height(),10==f.type?(i.target.style.cursor="none",1==f.thickness?f.erasureType=1*f.width/200:3==f.thickness?f.erasureType=2*f.width/200:5==f.thickness&&(f.erasureType=3*f.width/200),e.DOMerasureBack.style.width=2*f.erasureType+"px",e.DOMerasureBack.style.height=2*f.erasureType+"px",e.DOMerasureBack.style.display="block"):12==f.type?(i.target.style.cursor="none",e.DOMfluorescence.style.display="block",e.lock=!1):5==f.type?(i.target.style.cursor="Default",a(".textInput").css("cursor","move"),a(".textInput div").removeAttr("style")):i.target.style.cursor="Default"},this.canvas["on"+e.StartEvent]=function(t){if(e.allow_draw){var i=e.touch?t.touches[0]:t;if(5!=f.type&&12!=f.type){if(10==f.type){var r=i.clientX-a("#draw").offset().left,o=i.clientY-a("#draw").offset().top;e.movePoint(r,o);var n=e.x[0],s=e.y[0];f.draw=[{x:n,y:s}];var d=JSON.stringify(f),c=JSON.parse(d);DP.draw(c,!0)}else{var r=i.offsetX,o=i.offsetY;e.movePoint(r,o)}DP.save(),e.lock=!0}}},this.canvas["on"+e.MoveEvent]=function(t){if(e.allow_draw){var i=e.touch?t.touches[0]:t;if(e.lock){if(DP.restore(),10==f.type)var r=i.clientX-a(this).offset().left,o=i.clientY-a(this).offset().top;else var r=i.offsetX,o=i.offsetY;e.movePoint(r,o);for(var n=e.x[0],s=e.y[0],d="",h="",l={},u=[],p=0;p<e.x.length;p++)d=e.x[e.x.length-1]-n,h=e.y[e.x.length-1]-s,l.x=e.x[p],l.y=e.y[p],l=JSON.stringify(l),l=JSON.parse(l),u.push(l);var g=Math.sqrt(Math.pow(d*f.width,2)+Math.pow(h*f.height,2));switch(f.type){case 2:f.draw=u;break;case 3:var w={x:n,y:s,width:d,height:h};f.draw=w;break;case 4:var m=g/f.width,v=g/f.height,y={x:n+m,y:s+v,heightRadius:v,widthRadius:m};f.draw=y;break;case 10:case 11:case 13:f.draw=u}var D=JSON.stringify(f),b=JSON.parse(D);DP.draw(b,!0)}else if(12==f.type){f.draw=[];var r=i.pageX-this.getBoundingClientRect().left-e.DOMfluorescence.offsetWidth/2,o=i.pageY-this.getBoundingClientRect().top-e.DOMfluorescence.offsetHeight/2;e.movePoint(r,o);for(var d="",h="",P={},x=[],p=0;p<e.x.length;p++)P.x=e.x[p],P.y=e.y[p],P=JSON.stringify(P),P=JSON.parse(P),(x=[]).push(P);var k=f.page,_=f.name;f.width=a("#draw").width(),f.height=a("#draw").height(),f.drawid=c.viewerid+(new Date).getTime(),f.viewername=c.name,f.viewerid=c.viewerid,f.draw=x;var D=JSON.stringify(f),b=JSON.parse(D);DP.draw(b,!0),c.draw(_,k,b),e.x=[],e.y=[]}if(10==f.type){var r=i.pageX-this.getBoundingClientRect().left-f.erasureType,o=i.pageY-this.getBoundingClientRect().top-f.erasureType;e.DOMerasureBack.style.left=r+"px",e.DOMerasureBack.style.top=o+"px"}}},this.canvas["on"+e.EndEvent]=function(t){if(e.allow_draw){if(e.lock=!1,e.x=[],e.y=[],""==f.draw)return;if(5==f.type||12==f.type)return;if(2==f.type&&!f.draw.length)return;var i=f.page,r=f.name;f.width=a("#draw").width(),f.height=a("#draw").height(),f.drawid=c.viewerid+(new Date).getTime(),f.viewername=c.name,f.viewerid=c.viewerid,c.draw(r,i,f);var o=JSON.stringify(f),n=JSON.parse(o);DP.draw(n,!1),f.draw=""}},a("#draw").on("mouseleave",function(t){if(e.allow_draw){if(e.lock){if(e.lock=!1,e.x=[],e.y=[],""==f.draw)return;if(5==f.type)return;if(2==f.type&&!f.draw.length)return;var i=f.page,r=f.name;f.width=a("#draw").width(),f.height=a("#draw").height(),f.drawid=c.viewerid+(new Date).getTime(),f.viewername=c.name,f.viewerid=c.viewerid,c.draw(r,i,f);var o=JSON.stringify(f),n=JSON.parse(o);DP.draw(n,!1),f.draw=""}else if(12==f.type){f.draw="";var i=f.page,r=f.name;f.width=a("#draw").width(),f.height=a("#draw").height(),f.drawid=c.viewerid+(new Date).getTime(),f.viewername=c.name,f.viewerid=c.viewerid,c.draw(r,i,f),DP.draw(f,!0)}10==f.type&&((e.touch?t.touches[0]:t).target.style.cursor="Auto",e.DOMerasureBack.style.display="none")}})},movePoint:function(e,t){this.x.push(e/a("#draw").css("width").replace(/px/,"")),this.y.push(t/a("#draw").css("height").replace(/px/,""))},sendClear:function(){var e=f.page,t=f.name;f.type=0,f.drawid=c.viewerid+(new Date).getTime(),f.viewername=c.name,f.viewerid=c.viewerid;var a=JSON.stringify(f),i=JSON.parse(a);DP.clearScreen(i),c.draw(t,e,f),f.draw="",f.type=f.preType},clearPrev:function(){var e=f.page,t=f.name;f.type=9;for(var a=!1,i=f.docid+"_"+f.page,r=DP.caches[i].draws,o=r.length-1;o>=0;o--)if(r[o].viewerid===c.viewerid){f.drawid=r[o].drawid,a=!0;break}f.viewername=c.name,f.viewerid=c.viewerid,a&&(DP.clearPrev(f),c.draw(t,e,f)),f.draw="",f.type=f.preType}},y=function(e){if(this.id="draw-board",this.canvas=t.getElementById(this.id),this.cxt=this.canvas.getContext("2d"),!this.canvas)throw new Error("canvas is not exist");this.caches={},this.currentDocKey="WhiteBorad_0",this.zoom=1,this.imgmess="",this.dtw="",this.dth="",this.DOMfluorescence=t.getElementById("DOMfluorescence")},D={CLEAR_SCREEN:0,CLEAR_PREV:9,DRAW_LINE:2,DRAW_RECT:3,DRAW_ARC:4,DRAW_TXT:5,DELETE_DOC:6,CLEAR_DOC_DRAWS:7,DELETE_ERASURE:10,DRAW_STRAIGHTLINE:11,DRAW_FLUORESCENCE:12,DRAW_LASERPEN:13};y.prototype={init:function(e){this.reInit(e),c.on("draw",function(e){if((e=JSON.parse(e)).value.data.viewerid===c.viewerid)return!1;DP.draw(e.value.data)}),e||(v.allow_draw=!1),d()},reInit:function(e){a("#draw-board").attr("width",a("#draw-box").css("width").replace(/px/,"")),a("#draw-board").attr("height",a("#draw-box").css("height").replace(/px/,"")),a("#draw").css({width:a("#draw-box").css("width"),height:a("#draw-box").css("height"),"margin-top":"0"});var i=t.getElementById(this.id);this.dtw=this.tp_w=i.width,this.dth=this.tp_h=i.height},clearCache:function(){this.caches={},this.clearRect()},save:function(){this.SID=this.cxt.getImageData(0,0,this.canvas.width,this.canvas.height)},restore:function(){this.SID&&this.cxt.putImageData(this.SID,0,0)},flip:function(e){if(e){e=n(e),v.lock=!1,v.x=[],v.y=[],f.draw="",a(".textInput").remove(),m.name=f.name=e.fileName,m.id=f.docid=e.docid,m.totalpage=e.totalPage,m.currentPage=f.page=e.page,e.pageTitle?m.relativePage=Number(e.pageTitle):m.relativePage=e.relativePage;var i=this;s(e)&&i.reInit(v.allow_draw),i.ResetZoom("reset");var r=e.docid+"_"+e.page;i.currentDocKey=r,i.caches[r]?i.caches[r].j||(i.caches[r].j=e):i.caches[r]={doc:{id:e.docid,num:e.page,url:e.url,isWhiteBorad:s(e)},j:e,draws:[]};var o=t.getElementById(i.id),d=o.getContext("2d"),h={time:null,url:e.url,docId:e.docid,docName:e.fileName,docTotalPage:e.totalPage,pageNum:e.page,encryptDocId:e.docid,useSDK:e.useSDK,width:o.width,height:o.height,mode:e.mode,pageTitle:e.relativePage},l={action:"flip",data:{id:e.docid,name:e.fileName,totalPage:e.totalPage}};if("WhiteBorad"===e.fileName?l.data.currentPage=Number(m.relativePage):l.data.currentPage=Number(e.page)+1,c.emit("flipMessage",l),s(e))d.clearRect(0,0,o.width,o.height),v.setting(),i.pageChange(h),a.each(i.caches[r].draws,function(e,t){i.draw(t,!0)});else{var u=new Image,p=e.url;i.imgmess=u,u.crossOrigin="",u.src=p,u.onload=function(){var e=i.tp_h=this.height,t=i.tp_w=this.width;0===g?t/e>=a("#draw-box").width()/a("#draw-box").height()?(o.width=a("#draw-box").width(),o.height=parseInt(o.width*e/t)):(o.height=a("#draw-box").height(),o.width=parseInt(o.height*t/e)):(o.width=a("#draw-box").width()-20,o.height=parseInt(o.width*e/t)),a("#draw").css({width:o.width+"px",height:o.height+"px"}),h.width=o.width,h.height=o.height,i.pageChange(h),i.setMargin(),i.dtw=o.width,i.dth=o.height,a.each(i.caches[r].draws,function(e,t){i.draw(t,!0)})}}}},pageChange:function(e){console.log(e,"翻页数据"),"#"!==e.url&&-1===e.url.indexOf("https:")&&-1===e.url.indexOf("http:")&&(e.url="https:"+e.url);var t=JSON.stringify(e);p&&"#"!==e.url&&p.url===e.url&&l.clear(),l.pageChange(t),p=e},do_animation:function(e){var t={time:null,docTotalPage:parseInt(m.totalpage),pageNum:e.n,encryptDocId:e.id,step:e.s};console.log(t,"动画"),l.animationChange(JSON.stringify(t))},clearRect:function(){var e=this,a=t.getElementById(e.id);a.getContext("2d").clearRect(0,0,a.width,a.height)},clearDocDraws:function(t){var i=t.docid;a.each(this.caches,function(t,a){t.indexOf(i)>=0&&e.DP&&e.DP.caches&&delete e.DP.caches[t]})},clearScreen:function(e){var a=this;a.clearRect();var i=e.docid+"_"+e.page;a.caches[i]&&(a.caches[i].draws=[]);var r=t.getElementById(a.id);r.getContext("2d").clearRect(0,0,r.width,r.height)},clearPrev:function(e){var t=this;t.clearRect();for(var i=e.docid+"_"+e.page,r=e.drawid,o=t.caches[i].draws,n=o.length-1;n>=0;n--)o[n].drawid===r&&t.caches[i].draws.splice(n,1);a.each(t.caches[i].draws,function(e,a){t.draw(a,!0)})},deleteDoc:function(e){this.clearRect()},drawLine:function(e){var a=this,i=t.getElementById(a.id),r=i.getContext("2d");if(e.draw[0]){var n=e.draw[0].x*i.width,s=e.draw[0].y*i.height;r.beginPath(),r.strokeStyle=o(e.color),r.lineWidth=e.thickness*i.width/i.width,r.lineJoin="round",r.moveTo(n,s);for(var d=0;d<e.draw.length;d++){var c=e.draw[d].x*i.width,h=e.draw[d].y*i.height;r.lineTo(c,h)}r.stroke()}},laserPen:function(e){var a=this,i=t.getElementById(a.id),r=i.getContext("2d");if(e.draw[0]){var n=e.draw[0].x*i.width,s=e.draw[0].y*i.height;r.beginPath(),r.strokeStyle=o(e.color),r.lineWidth=3*e.thickness*i.width/i.width,r.lineJoin="round",r.moveTo(n,s);for(var d=0;d<e.draw.length;d++){var c=e.draw[d].x*i.width,h=e.draw[d].y*i.height;r.lineTo(c,h)}r.stroke()}},drawRect:function(e){var a=this,i=t.getElementById(a.id),r=i.getContext("2d"),n=e.draw.x*i.width,s=e.draw.y*i.height,d=e.draw.width*i.width,c=e.draw.height*i.height;r.beginPath(),r.strokeStyle=o(e.color),r.lineWidth=e.thickness*i.width/i.width,r.lineJoin="round",r.strokeRect(n,s,d,c),r.stroke()},straightLine:function(e){var a=this,i=t.getElementById(a.id),r=i.getContext("2d");if(e.draw[0]){var n=e.draw[0].x*i.width,s=e.draw[0].y*i.height,d=e.draw[e.draw.length-1].x*i.width,c=e.draw[e.draw.length-1].y*i.height;r.beginPath(),r.strokeStyle=o(e.color),r.lineWidth=e.thickness*i.width/i.width,r.lineJoin="round",r.moveTo(n,s),r.lineTo(d,c),r.stroke()}},fluorescence:function(e){var a=this,i=t.getElementById(a.id);i.getContext("2d");if(e.draw){a.DOMfluorescence.style.display="block";var r=e.draw[e.draw.length-1].x*i.width,o=e.draw[e.draw.length-1].y*i.height;this.DOMfluorescence.style.left=r+"px",this.DOMfluorescence.style.top=o+"px"}else a.DOMfluorescence.style.display="none"},drawArc:function(e){var a=this,i=t.getElementById(a.id),r=i.getContext("2d"),n=e.draw.heightRadius*i.height,s=e.draw.x*i.width-n,d=e.draw.y*i.height-n;r.beginPath(),r.strokeStyle=o(e.color),r.lineWidth=e.thickness*i.width/i.width,r.lineJoin="round",r.arc(s,d,n,0,2*Math.PI,!0),r.stroke()},clearERASURE:function(e){var a=this,r=t.getElementById(a.id),o=r.getContext("2d"),n=1;1==e.thickness?n=1:3==e.thickness?n=2:5==e.thickness&&(n=3);var s=n*this.canvas.width/200;e.draw.length;for(i in e.draw){var d=e.draw[i].x*r.width,c=e.draw[i].y*r.height;if(o.save(),o.beginPath(),o.arc(d,c,s,0,2*Math.PI),o.clip(),o.clearRect(0,0,r.width,r.height),o.restore(),i>=1){var h=e.draw[i-1].x*r.width,l=e.draw[i-1].y*r.height,u=s*Math.sin(Math.atan((c-l)/(d-h))),p=s*Math.cos(Math.atan((c-l)/(d-h))),g=h+u,w=l-p,f=h-u,m=l+p,v=d+u,y=c-p,D=d-u,b=c+p;o.save(),o.beginPath(),o.moveTo(g,w),o.lineTo(v,y),o.lineTo(D,b),o.lineTo(f,m),o.closePath(),o.clip(),o.clearRect(0,0,r.width,r.height),o.restore()}}},drawTxt:function(e){var i=this,r=t.getElementById(i.id),n=r.getContext("2d"),s=e.draw.label,d=e.draw.x*r.width,c=e.draw.y*r.height,h=e.draw.size*r.width/i.tp_w;n.font=h+"pt SimSun",n.fillStyle=o(e.color),n.textBaseline="top",n.textAlign="left";var l=s.split("\n");a.each(l,function(e,t){var a=1.9*h;n.fillText(t,d,c+a*e)})},ResetZoom:function(e){if("narrow"===e)this.zoom>.2&&(this.zoom=Number((this.zoom-.2).toFixed(2)));else if("enlarge"===e)this.zoom<2&&(this.zoom=Number((this.zoom+.2).toFixed(2)));else if("WhiteBorad"===e||"reset"===e)this.zoom=1;else if("dereset"===e){var t=this,i=a("#"+t.id),r=a("#draw-box").width(),o=a("#draw-box").height();"WhiteBorad"===m.name?DP.reInit():(0===g?t.imgmess.width/t.imgmess.height>=r/o?(t.dtw=r,t.dth=parseInt(t.imgmess.height*t.dtw/t.imgmess.width)):(t.dth=o,t.dtw=parseInt(t.imgmess.width*t.dth/t.imgmess.height)):(t.dtw=r-20,t.dth=parseInt(t.imgmess.height*t.dtw/t.imgmess.width)),i.attr({width:t.dtw*this.zoom,height:t.dth*this.zoom}),a("#draw").css({width:t.dtw*this.zoom+"px",height:t.dth*this.zoom+"px"})),t.caches&&t.caches[t.currentDocKey]&&t.caches[t.currentDocKey].draws&&a.each(t.caches[t.currentDocKey].draws,function(e,a){t.draw(a,!0)}),t.setMargin()}var n={action:"scale",data:{percent:this.zoom}};c.emit("flipMessage",n)},setMargin:function(){var e=t.getElementById(this.id);e.height<a("#draw-box").height()?a("#draw").css("margin-top",(a("#draw-box").height()-e.height)/2+"px"):a("#draw").css("margin-top","0")},scale:function(e){var t=this,i=a("#"+t.id);"WhiteBorad"===m.name?alert("白板不支持放大缩小"):(t.ResetZoom(e),i.attr({width:t.dtw*this.zoom,height:t.dth*this.zoom}),a("#draw").css({width:t.dtw*this.zoom+"px",height:t.dth*this.zoom+"px"}),t.setMargin(),a.each(t.caches[t.currentDocKey].draws,function(e,a){t.draw(a,!0)}))},draw:function(e,t){if("string"==typeof e&&(e=JSON.parse(e)),e){var a=e.docid+"_"+e.page,i=this;if(i.caches[a]||(i.caches[a]={doc:{id:e.docid,num:e.page},draws:[]}),t||i.caches[a].draws.push(e),e.type!=D.CLEAR_DOC_DRAWS){var r=i.caches[i.currentDocKey];if(r&&r.doc.id==e.docid&&r.doc.num==e.page)switch(12!=e.type&&(this.DOMfluorescence.style.display="none"),e.type){case D.CLEAR_SCREEN:this.clearScreen(e);break;case D.CLEAR_PREV:this.clearPrev(e);break;case D.DRAW_LINE:this.drawLine(e);break;case D.DRAW_RECT:this.drawRect(e);break;case D.DRAW_ARC:this.drawArc(e);break;case D.DRAW_TXT:this.drawTxt(e);break;case D.DELETE_DOC:this.deleteDoc(e);break;case D.CLEAR_DOC_DRAWS:this.clearDocDraws(e);break;case D.DELETE_ERASURE:this.clearERASURE(e);break;case D.DRAW_STRAIGHTLINE:this.straightLine(e);break;case D.DRAW_FLUORESCENCE:this.fluorescence(e);break;case D.DRAW_LASERPEN:this.laserPen(e);break;default:throw new Error("unknow draw type")}}else this.clearDocDraws(e)}}};var b={drawChange:function(e,t){switch(t.action){case"type":0!==f.type&&9!==f.type&&(f.preType=f.type),f.type=t.value,5!==f.type&&a("#drag_input").remove(),9===f.type?v.clearPrev():0===f.type&&v.sendClear();break;case"color":f.color=t.value;break;case"thickNess":f.thickness=t.value;break;case"size":f.fontSize=t.value;break;case"useDraw":v.allow_draw=t.value}},docChange:function(e,t){var i=t.data;switch(t.action){case"pre":0!==parseInt(m.mode)?0==m.animation_count?m.prePage():m.animation_count>0&&(0==m.current_animation?m.prePage():(m.current_animation=0,m.do_animation())):m.prePage();break;case"next":0!==parseInt(m.mode)?m.animation_count===m.current_animation?m.nextPage():(m.current_animation++,m.do_animation()):m.nextPage();break;case"skip":i.toPage&&m.slideTo(i.toPage);break;case"changeDoc":f.name=m.name=i.name,f.docid=m.id=i.id;d={action:"changeDoc",data:{id:m.id}};if("WhiteBorad"!==i.name){m.totalpage=i.totalpage,f.page=m.currentPage=0,m.docFromRoomId=i.docFromRoomId,m.mode=f.mode=i.mode,m.useSDK=f.useSDK=!!i.useSDK,d.data.urlArr=[];for(var r=0;r<m.totalpage;r++){var o=m.domain+"/image/"+m.docFromRoomId+"/"+m.id+"/"+r+".jpg";d.data.urlArr.push(o)}}else m.mode=f.mode=0,m.useSDK=f.useSDK=!1,m.relativePage=1,f.page=m.currentPage=m.whiteArr[m.relativePage-1],d.data.totalPage=m.totalpage=m.whiteArr.length;c.emit("flipMessage",d),m.slideTo(1);break;case"full":a("#"+h).css("position","fixed"),DP.ResetZoom("dereset");break;case"exitFull":a("#"+h).css("position","relative"),DP.ResetZoom("dereset");break;case"enlarge":DP.scale("enlarge");break;case"narrow":DP.scale("narrow");break;case"addBoard":m.name="WhiteBorad",m.id="WhiteBorad",m.whiteNum=m.whiteNum+1,m.whiteArr.push(m.whiteNum),m.currentPage=m.whiteNum,m.totalpage=m.relativePage=m.whiteArr.length,u&&P.setBoard();d={action:"changeDoc",data:{id:m.id,totalPage:m.totalpage}};c.emit("flipMessage",d),m.flip();break;case"deleteBoard":var n=i.page;if(m.whiteArr.length>1){m.whiteArr.splice(n-1,1);var s=m.whiteArr.indexOf(m.currentPage);-1===s?(m.relativePage>1&&(m.relativePage=m.relativePage-1),m.currentPage=m.whiteArr[m.relativePage-1]):m.relativePage=s+1,m.totalpage=m.whiteArr.length;var d={action:"changeDoc",data:{id:m.id,totalPage:m.totalpage}};c.emit("flipMessage",d),m.flip(),u&&P.setBoard()}}}},P={deleteNum:"",setCookie:function(e,a,i){var r=new Date,o=i;r.setTime(r.getTime()+24*o*3600*1e3),t.cookie=e+"="+a+";expires="+r.toGMTString()+"; path=/"},getCookie:function(e){for(var a,i=t.cookie.replace(/[ ]/g,"").split(";"),r=0;r<i.length;r++){var o=i[r].split("=");if(e===o[0]){a=o[1];break}}return a},delete:function(e){var a=new Date;a.setTime(a.getTime()-1e4),t.cookie=e+"=v; expires ="+a.toGMTString()+"; path=/"},setBoard:function(){var e=c.roomid+u,t={arr:m.whiteArr,num:m.whiteNum},a=JSON.stringify(t);P.setCookie(e,a,1)},getBoard:function(){var e=c.roomid+u,t=P.getCookie(e);if(t){var a=JSON.parse(t);m.whiteNum=a.num,m.whiteArr=a.arr}},deleteBoard:function(e){var t='<div class="out-box-2"><div class="inner"><h3><i class="fa icon-guanbipsd"></i></h3><p>'+e+'</p><p class="tips nothing">  </p><div><input type="button" class="cancel" value="'+a.i18n.prop("取消")+'"><input type="button" class="sure-delete" value="'+a.i18n.prop("确定")+'"></div></div><div class="mask"></div></div>';a("body").append(t)}};e.addEventListener("message",function(e){var t=e.data;"string"==typeof t&&(t=JSON.parse(t)),t&&"animation_change_from_dp"===t.action&&(m.animation_count=t.totalSteps-1)}),e.DocumentUpload=r,e.currentDoc=m}(window,document,jQuery);