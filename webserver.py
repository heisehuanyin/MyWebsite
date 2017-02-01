#!/usr/bin/env python3

"""
用python实现一个HTTP网络服务器，它直到如何提供HTTP页面和运行用Python编写的服务器端CGI脚本。本脚本不是一个产品级服务器，但能满足测试需求，尤其是在localhost上。
默认提供当前目录下的文件和脚本，端口号为80，除非在命令行参数中指定了这些选项；Python CGI脚本必须存放在webdir\cgi-bin或者webdir\htbin路径下，同一台机器上可以运行多个服务器，提供多个目录下的页面和脚本，只需要监听端口不同即可。
"""

import os,sys
from http.server import HTTPServer,CGIHTTPRequestHandler

webdir='.'
port=80
if len(sys.argv) > 1:
    webdir = sys.argv[1]

if len(sys.argv) > 2:
    port = int(sys.argv[2])

print("webdir '%s', port '%s'" % (webdir, port))

os.chdir(webdir)
srvraddr = ("",port)
srvrobj = HTTPServer(srvraddr, CGIHTTPRequestHandler)
srvrobj.serve_forever()