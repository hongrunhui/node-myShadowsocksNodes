# node-myShadowsocksNodes
--------------------------
nodejs实现的爬取[速飞跃](http://su.mljjlt.cn/)上的代理节点信息，并保存到本地，省的自己一个一个的扫二维码添加。

## 实现功能
	* 自动模拟登陆速飞跃
	* 爬取节点信息，并打印在控制台上
	* 保存到本地```nodes.json```文件中 
## 使用方法
	* 安装依赖```npm install```
	* 在![image](https://cloud.githubusercontent.com/assets/9162319/23933255/315dc17c-0978-11e7-936c-6a7fc76b74c5.png)这个填写自己的邮箱和密码
	* ``` node index.js ```
	* 得到输出结果：![image](https://cloud.githubusercontent.com/assets/9162319/23933302/998254f2-0978-11e7-9a32-bc04cce4c287.png)
	* 得到```nodes.json```文件，复制```configs```数组的所有对象替换```gui-config.json```中的```configs```的数组中。
	* 将```gui-config.json```复制到你shadowsocks.exe的同目录下。

## 说明
只是为了方便同样使用[速飞跃](http://su.mljjlt.cn/)同志们。