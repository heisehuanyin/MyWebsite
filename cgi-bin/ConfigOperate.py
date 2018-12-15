#!/usr/bin/env python3
'''
本模块通过接口提供配置字符串的管理操作
'''
import sqlite3
import Mw_ComnCfg as cfg
from AccountOperate import AccountTool


class ConfigManage:
    def __init__(self):
        '''
        通过构造函数构建与数据库文件的连接,以及初始化数据库
        '''
        self.__connection = sqlite3.connect(cfg.dataBasePath);
        exc = self.__connection.cursor();

        exc.execute("create table if not exists table_configmanage("
                    "id integer primary key autoincrement, "
                    "userid integer, "
                    "type text, "
                    "content text, "
                    "comment text, "
                    "constraint cm_ua foreign key(userid) "
                    "    references table_useraccount(id) "
                    "    on delete cascade "
                    ");");
        pass

    def saveUserConfig(self, accountName:str, type:str, content:str):
        '''
        本函数用于存储用户的自定义配置
        :param accountName: 用户账户名
        :param type: 配置类型
        :param content: 配置内容
        :return: 无
        '''
        xtool = AccountTool();
        actID = xtool.getAccountIDWithName(accountName);
        port = self.__connection.cursor();

        port.execute("insert into table_configmanage "
                     "(userid, type, content, comment) "
                     "values(?, ?, ?, '暂时无备注');", (actID, type, content));
        pass

    def getUserConfig(self, accountName:str, type:str)->(bool, str):
        '''
        本函数用于获取用户的自定义配置
        :param accountName: 用户名
        :param type: 配置类型
        :return: （查询结果，配置文本）True代表查询成功，结果正确；False代表失败，数据库中没有配置
        '''
        xtool = AccountTool();
        actID = xtool.getAccountIDWithName(accountName);
        port = self.__connection.cursor();

        port.execute("select "
                     "content "
                     "from table_configmanage "
                     "where (userid = ?) "
                     "and (type = ?);", (actID, type));
        result = port.fetchall();
        if len(result) > 0:
            return (True, result[0][0]);
        else:
            return (False, 'null');