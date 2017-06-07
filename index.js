var superagent  = require("superagent");
var agent       = superagent.agent();
var querystring = require('querystring');
var fs          = require('fs');
var cheerio     = require('cheerio');
var $;
require("console.table");

var url = {
    url:"http://su.mljjlt.cn/",
    login_url:"http://su.mljjlt.cn/user/_login.php",
    target_url:"http://su.mljjlt.cn/user/node.php"
};
var browserMsg = {
    "Accept":"application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding":"gzip, deflate",
    "Accept-Language":"zh-CN,zh;q=0.8",
    "Connection":"keep-alive",
    "Content-Length":"62",
    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
    "Host":"su.mljjlt.cn",
    "Origin":"http://su.mljjlt.cn",
    "Referer":"http://su.mljjlt.cn/user/login.php",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
    "X-Requested-With":"XMLHttpRequest",
};
var loginMsg = {
    "passwd":"",
    "remember_me":"week",
    "email":""
};
function getLoginCookie() {
    //  agent中会有cookie的信息，在回调中再使用agent访问其他页面则不会有限制，
    agent.get(url.login_url).set(browserMsg).end(function(err, response){
        console.log('-->',response.headers);
    });
    agent.post(url.login_url).set(browserMsg).send(loginMsg).end(function (err, response) {
        console.log(response.text);
        agent.get("http://su.mljjlt.cn/user/node.php").end(function(err,res){
            $ = cheerio.load(res.text);
            var ips = $(".box-body").find('.nav-tabs-custom');
            console.log('代理数量：------>',ips.length);
            var nodes = [];
            ips.each(function(i,item){
                var remarks = $(this).find(".header").text();
                var server = $(this).find("code").eq(0).text();
                var server_port = $(this).find("code").eq(1).text();
                var password = $(this).find("code").eq(2).text();
                var method = $(this).find(".bg-green").text();
                nodes.push({"remarks":remarks,"server":server,"server_port":server_port,"password":password,"method":method,"auth":false,"timeout":5});
                
            });
            console.table(nodes);
            fs.writeFile('nodes.json',JSON.stringify({"configs":nodes}));
        });
    });
}
getLoginCookie();