# MyWebsite
## 设计目标
* 设计一个导航网站，方便使用
	* 放置常用网站导航
	* 实时计算网站访问频率，自动排布导航布局
	* 自定义导航万战分类
* 设计一个小说阅读下载网站，方便阅读经典小说
	* 只限于阅读完结小说，不追更。因为网站不涉及爬虫，投入太大
	* 小说源文件需要手动上传，不涉及爬虫，投入产出比太大
	* 对于小说精校提供工具供使用者手动调整，自动调整太困难，投入太大。
	* 提供评论功能
* 设计一个新模式blog，方便观点的深度交流
	* 主要用于自研产品的发布和意见收集
	* 提供层次性的对话交流方式
	* 提供文件的上传下载功能

## 设计总体思路
* apache + cgi作为服务器主程序，SQLite嵌入式数据库，Text文档存储；
* 页面采用Typescript + JQuery + Html + CSS 构建；
* 浏览器接收模板页面，然后利用Ajax技术接受实际内容，利用Javascript （Typescript）本地计算进行排版；

## 设计架构
### 服务器
1. 通用基础架构：阿里云服务器（1核+1G+300GB）+ Apache + Python
2. 软件架构：
	3. 注册、登录验证（每打开一个页面执行一次，页面内操作不执行）-服务
		4. 用户注册-服务：（用户名+邮箱+密码 =》注册成功或失败）
			5. 用户名验证-服务
				{avaliable, unavaliable}
			7. 用户名验证-程序
				{continue，reject}
			8. 用户账户生成、存储-程序
			7. 回复成功-程序
		5. 用户登录-服务：（用户名+密码 =》证书或失败）
			7. 用户名与密码验证-程序
				{continue，reject}
			7. 证书生成（用户名+时间戳）-程序
			8. 证书存储索引-程序
			9. 证书下载（print）-程序
		6. 登录验证-程序：（用户名+证书 =》新证书）
			7. 用户名与证书验证-程序
				{continue，reject}
			8. @证书生成-程序
			9. @证书存储索引-程序
			1. @证书下载-程序
		7. 账户找回-服务：（用户名+邮箱 =》邮件+新密钥）
			8. @用户名验证-服务
			9. 用户名与邮箱验证-程序
				{continue，reject}
			9. 用户名与密码提取-程序
			9. 邮件发送-程序
			7. 回复成功-程序
	4. 自定义配置管理-服务
		5. 上传配置：（@登录验证 + 配置文件 =》 上传成功或失败）
			7. @登录验证-程序
			7. 配置文件接收-程序
			8. 配置文件索引、存储-程序
			7. 回复成功-程序
		6. 下载配置：（@登录验证 =》 配置文件或无）
			7. @登录验证-程序
			8. 配置文件索引、提取-程序 
			9. 配置文件下载-程序 

	5. 文本内容管理-服务
		6. 文本内容上传：（@登录验证 + 内容 =》上传成功或失败）
			7. @登录验证-程序
			8. 文本内容接收-程序
			9. 文本内容处理-程序
			7. 回复成功-程序
		7. 文本内容下载：（@登录验证 + 链接 =》下载成功或失败）
			7. @登录验证-程序
			9. 文本内容索引提取-程序
			10. 文本内容下载-程序
			
	5. 评论管理-服务
		6. 评论上传（@登录验证 + 评论 = 》 上传成功或失败）
			7. @登录验证-程序
			8. 评论内容接收-程序
			9. 评论内容索引和存储-程序
		7. 评论下载（@登录验证 + 目标 =》 下载成功或失败）
			8. @登录验证-程序
			9. 评论内容索引和提取-程序
			10. 评论内容下载-程序

	6. @文本内容处理-程序
		7. 文本源文件存储-程序
		7. 文本标题提取-程序
		8. 标题存储-程序
		8. 文本切割-程序
		9. 标题+切割文本存储程序
		10. 标题+切割文本索引程序

3. 数据库表格

用户账户信息表格（UserAccount）
<table >
<tr>
<td>英文名
<td>键名
<td>键类型
<td>键标识
<td>备注
</td>

<tr>
<td>id
<td>账户id
<td>integer
<td>主键
<td>autoincrement
</td>

<tr><td>actName
<td>账户名<td>text
<td>
<td>保证唯一
</td>

<tr>
<td>pswd
<td>密码
<td>text
<td>
<td>
</td>

<tr>
<td>email
<td>邮箱地址
<td>text
<td>
<td>不验证
</td>

<tr>
<td>token
<td>状态证书
<td>text
<td>
<td>每次登录验证都刷新一次
</td>

<tr>
<td>comment
<td>备注
<td>
<td>
<td>
</td>
</table>
配置文件管理表格（ConfigManage）
<table>
<tr>
<td>英文名
<td>键名
<td>键类型
<td>键标识
<td>备注
</td>
<tr>
<td>id
<td>配置id
<td>integer
<td>主键
<td>autoincrement
</td>
<tr>
<td>userid
<td>关联用户
<td>integer
<td>外键
<td>UserAccount:id
</td>
<tr>
<td>type
<td>配置分类
<td>text
<td>
<td>
</td>
<tr>
<td>content
<td>配置内容
<td>text
<td>
<td>
</td>
<tr>
<td>comment
<td>备注
<td>text
<td>
<td>
</td>
</table>

评论管理表格（DiscussManage）
<table>
<tr>
<td>英文名
<td>键名
<td>键类型
<td>键标识
<td>备注
</td>
<tr>
<td>id
<td>讨论id
<td>integer
<td>主键
<td>autoincrement
</td>
<tr>
<td>url
<td>引用链接
<td>text
<td>
<td>
</td>
<tr>
<td>target
<td>目标评论
<td>integer
<td>外键
<td>DiscussManage:id
</td>
<tr>
<td>user
<td>评论者
<td>integer
<td>外键
<td>UserAccount:id
</td>
<tr>
<td>reply
<td>回复
<td>text
<td>
<td>
</td>
<tr>
<td>comment
<td>备注
<td>text
<td>
<td>
</td>
</table>

### 客户端
1.	通用基础架构：PC + 浏览器
2. 软件架构：
	3. 注册、登录、验证服务模块
	4. 自定义配置文件加载服务
	5. 网页重排版服务