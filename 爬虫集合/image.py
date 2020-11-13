import os
import requests
import json

from bs4 import BeautifulSoup

index=0

#下载内容
def down_page(url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
               'Content-Type':'application/json'}

    r = requests.get(url,headers=headers)
    # r.encoding="gb18030"
    return r.json()

# 提取内容
def get_content(html):

    # soup = BeautifulSoup(html,"html.parser")
    # soup.encoding = 'gb18030'
    # html=html.encode("utf-8")
    # soup=json.loads(html)
    # conn=soup.find(id="walBox")
    # print(html)
    # soup=html.encode("utf-8")
    conn_list=html['data']
    # print(conn_list)
    for i in conn_list:
        # str=i.find_all("li")
        tag=i['tag']
        url=str(i['url']).replace("__85","2560_1600_100")
        save_text(tag,url)
        # print(i)
        # print(str)


#保存到指定位置
def save_text(tag,url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        'Content-Type': 'application/json'}
    output = """图片名称:{},下载地址：{}\n"""
    dirtxt="F://python/"
    dirImg="F://python/pic/girl/"
    if(not os.path.exists(dirtxt)):
        os.mkdir(dirtxt)
    if (not os.path.exists(dirImg)):
        os.mkdir(dirImg)

    result=requests.get(url,headers=headers)
    if(result.status_code==200):
        open(dirImg+tag+".jpg","wb").write(result.content)
    output.format(tag, url)
    for i in output:
        with open("F://python/pic.txt","a",encoding="utf-8") as f:
            f.write(i)
    global index
    index=index+1
    print("第{}个".format(index))

#主方法
def main():
    # url="http://tool.yijingying.com/imagetools/wallpaper/"
    for i in range(0,10):
        # 美女
        url="http://tool.yijingying.com/imagetools/wallpaper/api.php?cid=6&start={}&count=30".format(i*30)
        # url="http://tool.yijingying.com/imagetools/wallpaper/api.php?cid=35&start={}&count=30".format(i*30)
        html=down_page(url)

        get_content(html)


if __name__=="__main__":
    main()