#!/usr/bin/env python3

import sqlite3
import Mw_ComnCfg as cfg

class AccountTool:
    '''
    通过建立本类实例，构建一个账户操作专用工具，包括：
    1.创建账户
    2.验证账户存在否
    3.用户名与账户密码验证
    4.用户名与邮箱验证
    5.用户名与token验证

    self.__connection:连接
    '''
    def __init__(self):
        '''
        通过构造函数构建与数据库文件的连接,以及初始化数据库
        '''
        self.__connection = sqlite3.connect(cfg.dataBasePath);
        exc = self.__connection.cursor();

        exc.execute("create table if not exists table_useraccount("
                    "id integer primary key autoincrement, "
                    "actName text, "
                    "pswd text, "
                    "email text, "
                    "token text, "
                    "comment text "
                    ");");
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
        exc.execute("create table if not exists table_discussmanage("
                    "id integer primary key autoincrement, "
                    "url text, "
                    "target integer, "
                    "user integer, "
                    "reply text, "
                    "comment text, "
                    "constraint dm_dm foreign key(target) "
                    "   references table_discussmanage(id) "
                    "   on delete cascade, "
                    "constraint dm_ua foreign key(user) "
                    "   references table_useraccount(id) "
                    "   on delete cascade "
                    ");")
        pass

    def checkAccountExists(self, accountName:str) -> (bool, str):
        '''
        通过本函数确认账户名称是否存在
        :param accountName: 账户名称
        :return: （结果，附加String）
        '''
        exu = self.__connection.cursor();
        exu.execute("select actName "
                    "from table_useraccount "
                    "where actName = ?", [accountName]);
        if len(exu.fetchall()) > 0:
            return (True, "该账户已存在！");
        else:
            return (False, "该账户不存在！");

    def createAccount(self, accountName:str, password:str, email:str) -> str:
        '''
        通过本方法构建账户（存储账户名称，密码，email进入数据库，并生成token存储入数据库），
        返回token
        :param accountName: 账户名称
        :param password: 密码
        :param email: 邮件地址
        :return: token字符串
        '''
        exu = self.__connection.cursor();

        token = self.__calcAccountToken(accountName);

        exu.execute("insert into table_useraccount "
                    "(actName, pswd, email, token, comment) "
                    "values(?, ?, ?, ?, '未修改备注');",
                    (accountName, password, email, token));
        self.__connection.commit();
        return token;

    def checkAccountPassword(self, accountName:str, password:str)->(bool, int):
        '''
        校对账户名称与账户密码，如果账户密码与数据库相等，则返回True,账户id
        :param accountName: 账户名称
        :param password: 账户密码
        :return: 结果,账户id
        '''
        exu = self.__connection.cursor();

        exu.execute("select "
                    "pswd, "
                    "id "
                    "from table_useraccount "
                    "where actName = ?", [accountName]);
        result = exu.fetchone();
        if password == result[0]:
            return (True, result[1]);
        else:
            return (False, -1);

    def refreshAccountToken(self, accountName:str)->str:
        '''
        刷新账户中的token，并返回新token
        :param accountName: 账户名
        :return: 新token
        '''
        token = self.__calcAccountToken(accountName);
        exu = self.__connection.cursor();

        exu.execute('update table_useraccount '
                    'set '
                    'token = ? '
                    'where actName = ? ;', (token, accountName));

        self.__connection.commit();
        return token;

    def checkAccountToken(self, accountName:str, token:str)->bool:
        '''
        校验账户与token是否与数据库内值相等
        :param accountName: 账户名
        :param token: token字符串
        :return: 结果True or False
        '''

        exu = self.__connection.cursor();

        exu.execute("select "
                    "token "
                    "from table_useraccount "
                    "where actName = ?", [accountName]);
        result = exu.fetchone();
        if result[0] == token:
            return True;
            pass
        else:
            return False;

    def checkAccountEmail(self, accountName:str, emailAddress:str)->bool:
        exeu = self.__connection.cursor();

        exeu.execute("select "
                     "email "
                     "from table_useraccount "
                     "where actName = ?;", (accountName));
        result = exeu.fetchone();
        if result[0] == emailAddress:
            return True;
        else:
            return False;
        pass

    def getAccountPassword(self, accountName:str )->str:
        exu = self.__connection.cursor();

        exu.execute("select "
                    "pswd "
                    "from table_useraccount "
                    "where actName = ? ;", (accountName));
        result = exu.fetchone();
        return result[0];

    def __calcAccountToken(self, user:str) -> str:
        '''
        传入账户名称，计算新的token字符串，但是仅仅是计算，并不会刷新数据库
        :param user: 账户名称
        :return: 新的token字符串
        '''
        import random;
        number = random.random();
        return user + str(number);


if __name__ == "__main__":
    tool = AccountTool();
    result, reason = tool.checkAccountExists('TestUser');
    if not result:
        tool.createAccount("TestUser", 'adfkjadf', 'adf@akdf');
    print(reason);
