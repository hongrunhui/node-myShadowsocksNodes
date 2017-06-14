var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var $;
var exec = require('child_process').exec;
require("console.table");
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';
request = request.defaults({jar: true});
var ssPath = 'E:\\green\\Shadowsocks\\gui-configs.json';
var urls = {
    url:"http://su.mljjlt.cn/",
    login_url:"http://su.mljjlt.cn/user/_login.php",
    target_url:"http://su.mljjlt.cn/user/node.php",
    liuliang: "http://su.mljjlt.cn/user/index.php"
}
var temp = {
    "passwd":"速飞跃密码",
    "remember_me":"week",
    "email":"速飞跃邮箱"
}
try {
    var auth = JSON.parse(fs.readFileSync('config.json','utf-8'));
    
} catch (error) {
    if(!auth){
        console.log('用户信息没有写，请在config.json中补充信息。');
        fs.writeFile('config.json',JSON.stringify(temp));
    }
}
function Login(url, auth){
    request.post(url,function(error,response,body){
        if(response && response.statusCode==200){
            var info = JSON.parse(parseUnicode(body).substr(1));
            if(info.code!=1){
                console.log('登录失败,',info.msg);
                console.log('请查看config.json中邮箱密码是否正确');
                return;
            }else{
                console.log('登录成功,',info.msg);
            }
            var cookie = response.headers['set-cookie'];
            var s = [];
            if(Array.isArray(cookie) && cookie.length>0){
                for(var i=0;i<cookie.length;i++){
                    s.push(cookie[i].split(';')[0]);
                }
            }else{
                return;              
            }
            s = s.join('; ');
            fs.writeFile('cookies.txt',s,function(){
                console.log('Cookie写入成功...');
                getPage(urls.target_url);
            });
        }else{
            console.log('请求失败');
        }
    }).form(auth);
}
// Login(urls.login_url, auth);//cookie失效的时候执行一遍获取新的cookie,
function getPage(target_url){
    var j = request.jar();
    try {
        var cookie = fs.readFileSync('cookies.txt','utf-8');
        
    } catch (error) {
        Login(urls.login_url, auth);
        return;
    }
    var cc = cookie.split('; ');
    for(var i=0;i<cc.length;i++){//将Cookie添加到目标网址中去，添加之后便可实现模拟登录
        j.setCookie(request.cookie(cc[i]),target_url);
    }
    var min,minIndex,result;
    request({url:target_url,jar:j},function(e,r,data){
        if(r && r.statusCode==200){
            // console.log(data);
            $ = cheerio.load(data,{decodeEntities: false});
            var ips = $(".box-body").find('.nav-tabs-custom');
            if(ips.length==0){
                console.log('可能是Cookie失效了，正在尝试重新登录...');
                Login(urls.login_url, auth);
                return;
            }
            console.log('========================= 代理数量：%d =========================',ips.length);
            var nodes = [];
            ips.each(function(i,item){
                var remarks = $(this).find(".header").text();
                var server = $(this).find("code").eq(0).text();
                var server_port = $(this).find("code").eq(1).text();
                var password = $(this).find("code").eq(2).text();
                var method = $(this).find(".bg-green").text();
                var self = $(this);
                exec('ping'+' '+server,{ encoding: binaryEncoding },function(err,stdout,stderr){
                    var data = iconv.decode(new Buffer(stdout, binaryEncoding), encoding);
                    // console.log(iconv.decode(new Buffer(stdout, binaryEncoding), encoding));
                    var timeout = data.substr(data.indexOf('平均')+4).replace(/ |\\n|\\t/,'');
                    var time = parseInt(timeout.replace(/ms/,''));
                    if(i==0){
                        min = time;
                        minItem = self;
                    }else{
                        if(min>time){
                            min = time;
                            minItem = self;
                        }
                    }
                    if(i==ips.length-1){
                        result = minItem.find('.header').text()+'('+minItem.find("code").eq(0).text()+'):'+min+'ms';
                    }
                    console.log(remarks+'('+server+')'+':'+timeout);
                });
                
                nodes.push({"remarks":remarks,"server":server,"server_port":server_port,"password":password,"method":method,"auth":false,"timeout":5});
                
            });
            console.table(nodes);
            // fs.writeFile('nodes.json',JSON.stringify({"configs":nodes}));
            try {
                var config = JSON.parse(fs.readFileSync('gui-config.json'));
                config["configs"] = nodes;
            } catch (error) {
                console.log(error);
            }
            fs.writeFile(ssPath,JSON.stringify(config),function(){
                console.log(' 成功更新SS的节点!!!\n');
            });
            process.on('exit', function () {
                if(ips.length==0)return;
                console.log('最小ping值',result);
            });
        }else{
        }
        
    });
    for(var i=0;i<cc.length;i++){//将Cookie添加到目标网址中去，添加之后便可实现模拟登录
        j.setCookie(request.cookie(cc[i]),urls.liuliang);
    }
    request({url:urls.liuliang,jar:j},function(e,r,data){
        if(r && r.statusCode==200){
            $ = cheerio.load(data,{decodeEntities: false});
            var p = $(".progress.progress-striped").siblings();
            var s = '';
            p.each(function(i,item){
                s += $(this).text()+'\n';
            });
            console.log('\n 流量使用情况：\n'+s);
        }else{
            console.log('请求不成功');
        }
    });
}
function parseUnicode(data) {//用于将unicode转换成中文
    return unescape(data.replace(/u'/g,"'").replace(/\\u/g, '%u')).replace(/None/g,"''").replace(/'/g,'"').replace(/\/r\/n/g,"");
}
getPage(urls.target_url);//执行函数
