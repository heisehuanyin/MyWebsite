#!/usr/bin/env python3
'''
本模块专用于下载用户配置文件,需要提供以下几个键值：
actName : accountName
token   : 授权token
type    : 配置分类
'''

import cgi
from AccountOperate import AccountTool
from ConfigOperate import ConfigManage
from ReplyTool import Reply,Recieve


form = cgi.FieldStorage();
Recieve().checkArgumentsValid(form, ['actName', 'token', 'type']);

accountName = form.getfirst('actName', '');
token=form.getfirst('token','');
type=form.getfirst('type','');


xtool = AccountTool();
result = xtool.checkAccountToken(accountName, token);
if not result:
    Reply('anytoken', False, "客户端未授权，请登录客户端！").submit();
    exit(0);
    pass

token = xtool.refreshAccountToken(accountName);

cfgtool = ConfigManage();
result,string = cfgtool.getUserConfig(accountName, type);
if not result:
    Reply(token, False, "服务器中没有配置！").submit();
    exit(0);
    pass

reply = Reply(token, True, "配置提取成功");
doc = reply.getDocumentObject();
textElm = doc.createTextNode(string);
reply.addContent(textElm);
reply.submit();