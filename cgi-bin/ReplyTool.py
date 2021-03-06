#!/usr/bin/env python3

from xml.dom.minidom import getDOMImplementation
import sys
import codecs, sys

sys.stdout = codecs.getwriter('utf8')(sys.stdout.buffer);

'''
本模块应用于创建ajax调用回复信息，格式化回复信息，方便使用
基本回复格式如下：
doctype 
reply:rootElement
  |----<result value = "True or False" />
  |----<reson>Why</reson>
  |----<token token="str" />
  |----<content>:type <= text 
  |         |--......useful section
'''


class Reply:
    def __init__(self, tokenStr:str, resultV:bool, reasonStr:str):
        '''
        通过固定的Reply类型创建合法回复
        :param tokenStr: 即时token，用于下次会话授权
        :param resultV: 服务执行结果指示
        :param reason: 执行结果提示信息
        '''
        impl = getDOMImplementation();
        self.__doc = impl.createDocument(None, "reply", None);

        top_elm = self.__doc.documentElement;
        result = self.__doc.createElement('result');
        result.setAttribute('value', str(resultV));
        top_elm.appendChild(result);

        reason = self.__doc.createElement('reason');
        why = self.__doc.createTextNode(reasonStr);
        reason.appendChild(why);
        top_elm.appendChild(reason);

        token = self.__doc.createElement('token');
        token.setAttribute('token', tokenStr);
        top_elm.appendChild(token);

        self.__content = self.__doc.createElement('content');
        top_elm.appendChild(self.__content);
        pass


    def getDocumentObject(self)->object:
        '''
        通过本函数获取其内部doc实例，用于向reply上添加新节点
        :return: 内部实际doc
        '''
        return self.__doc;

    def addContent(self, domNode:object):
        '''
        将实际工作用到的DOM添加到回复的content节点下
        :param domNode:
        :return: 无
        '''
        self.__content.appendChild(domNode);

    def toString(self) -> str:
        '''
        转换本回复为字符串
        :return: Reply的文本表示
        '''
        return self.__doc.toxml();

    def submit(self):
        '''
        发送回复的便捷方法，直接print本回复
        :return: 无
        '''
        print('Content-type: text/xml\n');

        xml = self.toString();
        print(xml);
        sys.stdout.flush();
        pass

class Recieve:
    def checkArgumentsValid(self, fieldStorage:{}, itemList:[]) -> bool:
        '''
        校验给定的fieldStorage中是否存在itemList中的任一项：
        不存在则结束程序，并回复错误；
        存在则返回True
        :param itemList: 指定字符串列表
        :param fieldStorage: 校验目标
        :return: 结果
        '''
        for item in itemList:
            if item not in fieldStorage:
                x = Reply('anytoken', False, "页面提交信息错误，缺少：" + item + " !");
                x.submit();
                exit(0);
                pass
            pass

        return True;