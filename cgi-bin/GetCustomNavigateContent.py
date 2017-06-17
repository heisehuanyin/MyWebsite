#!/usr/bin/env python3

import cgi
import os


loginform = cgi.FieldStorage()
accountName = loginform.getvalue('name', "no_name")
accessKey = loginform.getvalue('accesskey', 'no_key')

print('Content-type:text/plain\n')


if accountName == 'no_name':
    print('no_name')
    exit(0)

if accessKey == 'no_key':
    print('no_key')
    exit(0)

if 'CustomNavigate]' not in accessKey:
    exit(0)


# 转到账户数据目录总目录
os.chdir('/mnt/disk_b/file-data/accountDataCollect/')

if not os.path.exists(accountName):
    os.mkdir('./'+accountName)
    pass

# 转到个人账户目录
os.chdir('./'+accountName)


# 如果没有该文件就生成一个空白文件
if not os.path.exists('CustomNavigate.xml'):
    xmlContent= '''<?xml version="1.0" encoding="utf-8"?><root id="rootNode"><li>
        <a href="http://www.jd.com" target="_blank" collectnum="0" style="animation-delay: 6s;">
            <img src="http://img.9553.com/uploadfile/2016/1027/20161027053122646.jpg"/>
        </a>
        <p>购物</p>
        <ul>
            <li>
                <div>
                    <a href="http://www.jd.com" target="_blank">
                        <img src="http://img.9553.com/uploadfile/2016/1027/20161027053122646.jpg"/>
                    </a>
                </div>
                <div>
                    <a href="http://www.tmall.com" target="_blank">
                        <img src="http://image.tupian114.com/20120923/18285581.jpg"/>
                    </a>
                </div>
                <div>
                    <a href="https://www.taobao.com/" target="_blank">
                        <img src="https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1497099980526&amp;di=df7b3021381318b7cea83da6603e4fc2&amp;imgtype=0&amp;src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F17%2F92%2F71%2F31s58PICy5P_1024.jpg"/>
                    </a>
                </div>
            </li>
        </ul>
    </li></root>'''
    customxml = open('CustomNavigate.xml', 'w')
    customxml.write(xmlContent)
    customxml.close()
    pass

xmlfile = open('CustomNavigate.xml')

xmlContent = xmlfile.readlines();

for line in xmlContent:
    print(line)
    pass