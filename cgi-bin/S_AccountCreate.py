#!/usr/bin/env python3

import cgitb,cgi
import ReplyTool
import AccountTool

'''
本模块用于提供创建账户服务，该服务对外提供接口，输入需要包含以下键值：
    actName : accountName
    pswd    : password
    email   : email address
'''

form = cgi.FieldStorage;

if ('actName' not in form) or ('pswd' not in form) or ('email' not in form):
    x = ReplyTool.Reply('anytoken', False, "页面提交信息错误！");
    x.submit();
    exit(0);
    pass


accountName = form.getfirst("actName", "");
password = form.getfirst('pswd', "");
email = form.getfirst('email', '');


tool = AccountTool.AccountTool();

result, String = tool.checkAccountExists(accountName);
if result:
    response = ReplyTool.Reply('anytoken', False, "未能注册，账户已存在！");
    response.submit();
    exit(0)
    pass

newToken = tool.createAccount(accountName, password, email);
response = ReplyTool.Reply(newToken, True, "注册成功!");
response.submit();