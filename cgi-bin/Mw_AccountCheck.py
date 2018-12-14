#!/usr/bin/env python3

import cgi
import sqlite3
import cgitb
import Mw_ComnCfg as cfg

cgitb.enable();





class AccountTool:
    '''
    通过建立本类实例，构建一个操作工具专注账户功能验证;
    self.__connection:连接
    self.__curse:游标
    '''
    def __init__(self):
        '''
        通过构造函数构建与数据库文件的连接
        '''
        self.__connection = sqlite3.connect(cfg.dataBasePath);
        self.__curse = self.__connection.cursor();
        pass
    def checkAccountExists(self, accountName:str) -> (bool, str):
        '''
        通过本函数确认账户名称是否存在
        :param accountName: 账户名称
        :return: （结果，附加String）
        '''

        pass
    def checkAccount(self, accountName:str, password:str, email:str)->str:
        '''
        通过本方法构建账户（存储账户名称，密码，email进入数据库，并生成token存储入数据库），
        返回token
        :param accountName: 账户名称
        :param password: 密码
        :param email: 邮件地址
        :return: token
        '''
        pass
