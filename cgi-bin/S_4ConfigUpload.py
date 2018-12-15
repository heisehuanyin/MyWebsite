#!/usr/bin/env python3
'''
本模块专用于配置字符串的上传，接收客户端上传的配置字符串保存起来
需要客户端提供一下键值：
actName : accountName
token   : 授权token
type    : 配置分类
content : 配置内容
'''

import cgi
from AccountOperate import AccountTool
from ConfigOperate import ConfigManage
from ReplyTool import Reply,Recieve

form = cgi.FieldStorage();

Recieve().checkArgumentsValid(form, ['actName','token','type','content']);

accountName=form.getfirst('actName', '');
token=form.getfirst('token','');
type=form.getfirst('type','');
content=form.getfirst('content','');

xtool = AccountTool();
result = xtool.checkAccountToken(accountName, token);
if not result:
    Reply('anytoken', False, "客户端未授权，请登录客户端！").submit();
    exit(0);
    pass

token = xtool.refreshAccountToken(accountName);

cfgtool = ConfigManage();
cfgtool.saveUserConfig(accountName, type, content);
Reply(token, True, "配置保存成功！").submit();