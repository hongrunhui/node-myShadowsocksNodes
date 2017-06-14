# node-myShadowsocksNodes
--------------------------
nodejs实现的爬取[速飞跃](http://su.mljjlt.cn/)上的代理节点信息，并保存到本地，省的自己一个一个的扫二维码添加。

## 实现功能
* 自动模拟登录速飞跃
* 爬取节点信息，并打印在控制台上
* 更新SS的gui-config.json文件，重启SS即可实现更新
## 使用方法
* 安装依赖```npm install```
* 先运行一次程序 ```node main.js```,此时会新建一个```config.json```文件，用于配置账号密码，运行结果：![image](https://user-images.githubusercontent.com/9162319/26862545-cbe94e1c-4b7e-11e7-8ae9-923c89dba50d.png)
* 在```config.json```中写入账号密码，然后再运行```node main.js```,即可实现获取节点信息，并会判断哪一个节点最快（ping值最小）
* 得到输出结果：<br/>![image](https://user-images.githubusercontent.com/9162319/26862586-1f0bfe46-4b7f-11e7-96ba-e1c2ee7c1707.png)
* ~~得到```nodes.json```文件，复制```configs```数组的所有对象替换```gui-config.json```中的```configs```的数组中。~~
* ~~将```gui-config.json```复制到你shadowsocks.exe的同目录下，重启复制到你shadowsocks,可以看到节点更新成功。~~
* 进入到```git安装根目录+\etc\profile.d```（如我的就是```E:\red\Git\etc\profile.d```），找到```aliases.sh```，打开编辑它，在末尾加入```alias myss="F:/mydata/node-myShadowsocks/start.sh"```（自己改一改node-myShadowsocks的目录），如下：<br/>![image](https://user-images.githubusercontent.com/9162319/26959773-834de49c-4d04-11e7-9482-d2db980bda27.png)
* 最后随便打开一个```git bash```输入```myss```都能执行，如下图：<br/>![image](https://user-images.githubusercontent.com/9162319/26959867-59abeeda-4d05-11e7-9ea4-8afe62cc5352.png)
* 支持查看流量使用情况。
* 支持直接修改ss的节点配置文件，无需手动复制到gui-config.json文件。

## 说明
```index.js```使用的是```superagent```，```main.js```使用的是```request```,两个文件均实现了模拟登录获取节点，但推荐使用```main.js```.写这个只是为了方便同样使用[速飞跃](http://su.mljjlt.cn/)同志们，当然也可以用来学习如何用```node.js```来写爬虫实现模拟登录。