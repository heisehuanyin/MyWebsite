#!/usr/bin/env python3

import cgitb,cgi
import xml.dom
import Mw_AccountTool
import Mw_ReplyTool
cgitb.enable();

'''
本模块定义了一项服务，“检测账户是否已经存在”，具有回复功能
要求输入源具有 actName键关联accountName
'''

form = cgi.FieldStorage()

if "actName" not in form:
    x = Mw_ReplyTool.Reply('anytoken', False, "页面提交信息错误！");
    x.submit();
    exit(0);
    pass

accountName = form.getfirst("actName", "");

atool = Mw_AccountTool.AccountTool();
result,string = atool.checkAccountExists(accountName);
if not result:
    x = Mw_ReplyTool.Reply('anytoken', True, string);
    x.submit();
    exit(0);
    pass

x = Mw_ReplyTool.Reply('anytoken', False, string);
x.submit();
