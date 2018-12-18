#!/usr/bin/env python3

'''
本模块用于接收用户上传的文件，不仅仅是小说文本文件
需要提供一下键值：
actName     : accountName
token       : 授权token
fileSymbo   : 二进制文件
limits      : 权限类别
fileName    : 文件命名
auther      : 文件作者
tags        : 标签集合
desc        : 文件描述
'''

import cgi
from ReplyTool import Recieve,Reply


form = cgi.FieldStorage();
Recieve().checkArgumentsValid(form, ['actName', 'token',    'fileSymbo',
                                     'limits',  'fileName', 'auther',
                                     'tags',    'desc']);

accountName=form.getfirst('actName','');
token=form.getfirst('token','');
fileSymbo=form.getfirst('fileSymbo','');
limits=form.getfirst('limits','');
fileName=form.getfirst('fileName','');
auther=form.getfirst('auther','');
tags=form.getfirst('tags','');
desc=form.getfirst('desc','');

