from django.shortcuts import render
# from django import forms
#from django.utils.translation import ugettext as _
from django.shortcuts import redirect
# from django.http import JsonResponse
from bs4 import BeautifulSoup
# import http.cookies
# import urllib.request
import requests
import mysql.connector
# import json
from multiprocessing import Pool
import re
import json

def parselinks(word):
    results=[]
    try:
        kkeyword=word['word']
        link = requests.get(word['url'], headers={'User-Agent': 'Mozilla/5.0'})
        results.extend(olx_soup(kkeyword,link))
    except:
        print("An exception occurred-main loop")
    return results

def olx_ad(soup):
    try:
        for i in soup.select(".css-ox1ptj"):
            if "utila" in i.get_text():
                net_area=int(re.search(r'\d+',i.get_text()).group())
    except:
        pass
    ad_id=int(re.search(r'\d+', soup.find("div", attrs={"data-cy": "ad-footer-bar-section"}).find("span").get_text()).group())
    return ad_id, net_area

def storia_ad(soup):
    json_object = json.loads(soup.find('script', type='application/json', id="__NEXT_DATA__").contents[0])
    ad_id=int(json_object['props']['pageProps']['ad']['id'])
    net_area=int(float(json_object['props']['pageProps']['ad']['target']['Net_area']))
    return ad_id, net_area
                 
def olxhtmlparser(kkeyword,soup_main):
    results=[]
    prom_res={}
    soup = soup_main.find('table', {'class': 'fixed offers breakword redesigned'})
    if soup:
        soup = soup.find_all('tr', {'class': 'wrap'})
        for obj in soup:
            prom_res['keyword'] = kkeyword
            prom_res['net_area']="n/a"
            prom_res['ad_id']="n/a"
            prom_res['psqm']="n/a"
            
            try:
                prom_res['app_link'] = obj.select('a.marginright5.link.linkWithHash')[0].get('href')
                html2 = requests.get(prom_res['app_link'])
                soup2 = BeautifulSoup(html2.content, 'html.parser')
            except:
                prom_res['app_link']="app_link Error-Fix Me"
                print("app_link Error-Fix Me")
            try:
                prom_res['ad_id'], prom_res['net_area']  = olx_ad(soup2)
            except:
                pass
            try:
                prom_res['ad_id'], prom_res['net_area'] = storia_ad(soup2)
            except:
                pass

            try:
                prom_res['title'] = obj.select('a.marginright5.link.linkWithHash')[0].get_text().replace('\n','').strip(' ')
            except:
                prom_res['title']="Title Error-Fix Me"

            try:
                prom_res['image_link'] = obj.find('img', {'class': 'fleft'})['src'].replace('\n','').strip(' ')
            except:
                prom_res['image_link']="https://gmtools.co.uk/wp-content/uploads/2014/12/blank-banner-200x200.jpg"

            try:
                prom_res['price'] = obj.find('p', {'class': 'price'}).get_text().replace('\n','').strip(' ')
                prom_res['sortprice'] = int(prom_res['price'].replace(" ", "")[:-1])
            except:
                prom_res['price']="priceERR"
                prom_res['sortprice']=9900000
                print("price error")
            try:
                prom_res['location'] = obj.find('div', {'class': 'space rel'}).find('p',{'class':'lheight16'}, recursive=False).get_text().replace('\n','').strip(' ')
            except:
                prom_res['location']="location Error-Fix Me"
            
            try:
                prom_res['psqm']=int(int(prom_res['sortprice'])/int(prom_res['net_area']))
                prom_res['sortpsqm']= prom_res['psqm']
            except:
                prom_res['psqm']="psqmERR"
                prom_res['sortpsqm']=9900
                print("psqm error")
            results.append(prom_res)
            prom_res={}
    return results

def olx_soup(kkeyword,link):
    subresults=[]
    soup_main = BeautifulSoup(link.text, features="html.parser")
    subresults.extend(olxhtmlparser(kkeyword,soup_main))
    print("added resutls for keyword=",kkeyword,"-link=",link.url,"\n-status=",link)
    
    try:
        nextlink = soup_main.select('a[data-cy="page-link-next"]')[0]
        print("trying next page")
        nextlinklink = requests.get(nextlink.get('href'), headers={'User-Agent': 'Mozilla/5.0'})
        # soup_main_next=BeautifulSoup(nextlinklink.text, features="html.parser")
        subresults.extend(olx_soup(kkeyword,nextlinklink))
        del nextlink
    except:
        print("no next page found")
        pass                             
    return subresults


def search_page(request):
    al = []
    results = []
    data1 = request.GET['keywords_txtarea']
    print(data1)
    data2 = request.GET['url1']
    print(data2)
    data3 = request.GET['url2']
    print(data3)

    for line in iter(data1.splitlines()):
        key_words = {}
        line = line.replace(' ', '-').replace('\n', '')
        key_words['word'] = line
        key_words['url'] = data2+str(line.strip('\n'))+data3
        al.append(key_words)

    # for word in al:
    #     results.extend(parselinks(word))        

    p = Pool(10)  # Pool tells how many at a time
    mpresults = p.map(parselinks, al)
    p.terminate()
    p.join()

    for elem in mpresults:
        results.extend(elem)

    existing_dicts = set()
    filtered_list = []
    for d in results:
        if d['ad_id'] not in existing_dicts:
            existing_dicts.add(d['ad_id'])
            filtered_list.append(d)

    return render(request, 'results.html', {'results': filtered_list, 'rang': len(filtered_list)})

def form_search_page(request):
    return render(request, 'searchform.html')