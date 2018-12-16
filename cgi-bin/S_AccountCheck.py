#!/usr/bin/env python3

import cgi
import AccountOperate
import ReplyTool


'''
本模块定义了一项服务，“检测账户是否已经存在”，具有回复功能
要求输入源具有 actName键关联accountName
'''

form = cgi.FieldStorage()
ReplyTool.Recieve().checkArgumentsValid(form,['actName']);

accountName = form.getfirst("actName", "");

atool = AccountOperate.AccountTool();
result,string = atool.checkAccountExists(accountName);
if not result:
    x = ReplyTool.Reply('anytoken', True, string);
    x.submit();
    exit(0);
    pass

x = ReplyTool.Reply('anytoken', False, string);
x.submit();
