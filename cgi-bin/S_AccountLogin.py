#!/usr/bin/env python3

'''
脚本用于核对账户名与密码，成功则发送授权token，也就是俗称的登录
输入满足一下键值：
actName : accountName
pswd    : password
'''
import cgi
from AccountOperate import AccountTool
from ReplyTool import Reply,Recieve

form = cgi.FieldStorage();

Recieve().checkArgumentsValid(form, ['actName', 'pswd']);

accountName = form.getfirst('actName',"");
password = form.getfirst('pswd',"");

tool = AccountTool();

result, string = tool.checkAccountExists(accountName);
if not result:
    x = Reply('anytoken', False, "账户不存在！");
    x.submit();
    exit(0);
    pass

result, id = tool.checkAccountPassword(accountName, password);
if not result:
    x = Reply('anytoken', False, "账户密码错误");
    x.submit();
    exit(0)
    pass

newToken = tool.refreshAccountToken(accountName);
x = Reply(newToken, True, "登录成功！");
x.submit();
