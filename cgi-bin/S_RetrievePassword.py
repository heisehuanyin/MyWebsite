#!/usr/bin/env python3

'''
本模块专门用于找回自己的账户和密码，如果提供参数与存储相符合，发送账户名与密码到指定邮箱
actName : accountName
email   : email Address
'''

import cgi
from AccountOperate import AccountTool
from ReplyTool import Reply,Recieve
import SendEmail

form = cgi.FieldStorage();
Recieve().checkArgumentsValid(form, ['actName','email']);

accountName = form.getfirst('actName',"");
emailAddress= form.getfirst('email', "");

tool = AccountTool();

result, string = tool.checkAccountExists(accountName);
if not result:
    x = Reply('anytoken', False, '账户不存在！');
    x.submit();
    exit(0)
    pass

result = tool.checkAccountEmail(accountName, emailAddress);
if not result:
    x = Reply('anytoken', False, "Email地址错误！");
    x.submit();
    exit(0);
    pass

password = tool.getAccountPassword(accountName);

SendEmail.Send(emailAddress, "您的重要账户信息", "账户名:" + accountName
                                            + "\n 密码：" + password);
Reply('anytoken', True, "操作成功，您的账户名称和密码已经发送到您的邮箱，请注意查收！").submit();
