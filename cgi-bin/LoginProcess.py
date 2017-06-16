#!/usr/bin/env python3

import cgi
import dbm
import os


loginform = cgi.FieldStorage()
accountName = loginform.getvalue('name', "no_name")

print('Content-type:text/plain\n')
if accountName == 'no_name':
    print('no_name')
    exit(0)

os.chdir('/mnt/disk_b/file-data/')
file = dbm.open('account', 'c')
if accountName not in file:
    print('no_data')
    exit(0)
controlmark = file[accountName]

# controlmark example
# password=something;access=acc,abb]bcc,add];

pairsCollection = controlmark.decode().split(';')
for pair in pairsCollection:
    if 'password' in pair:
        password = pair[pair.find('=')+1:]
        if password == loginform.getvalue('password'):
            break
        pass

else:
    print('passworderror')
    file.close()
    exit(0)
    pass

for pair in pairsCollection:
    if 'access' in pair:
        access = pair[pair.find('=')+1:]
        print(access)
        file.close()
        exit(0)