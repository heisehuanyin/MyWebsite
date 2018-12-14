#!/usr/bin/env python3

import smtplib,sys,email.utils
from email.mime.text import MIMEText
import Mw_ComnCfg as Cfg

'''
本程序应用于向任意邮箱发送电子邮件,需要传入‘toEmail地址’，'抬头', ‘内容’
命令行参数格式：
    propram ToEmail title Content
'''


def Send(toEmail:str, title:str, content:str)->(bool, str):
    '''
    本函数用于发送电子邮件，脚本中通过硬编码的方式规定了邮件服务器的地址，账户名，密码，需要提供‘目标邮箱地址’，‘邮件标题’，‘邮件内容信息’
    :param toEmail: 目标邮箱地址
    :param title: 邮件标题
    :param content: 邮件内容
    :return: 执行结果（结果，原因字符串）
    '''
    msg = MIMEText(content, 'plain', 'utf-8')  ##_subtype有plain,html等格式，避免使用错误

    msg['Subject'] = title
    msg['From'] = Cfg.fromEmail
    msg['To'] = toEmail

    serverInstance = smtplib.SMTP(Cfg.serverAddress, 25);
    try:
        serverInstance.login(Cfg.fromEmail, Cfg.password);
        failed = serverInstance.sendmail(Cfg.fromEmail, toEmail, msg.as_string());
    finally:
        serverInstance.quit();
        pass

    if(failed):
        return (False, "Operate failed! =>" + failed);
    else:
        return (True, "Operate success!");


if __name__ == "__main__":
    toEmail = sys.argv[1];
    Title = sys.argv[2];
    Content = sys.argv[3];

    result,reason = Send(toEmail, Title, Content);
    print(reason);
    print("Bye!");