from django.shortcuts import render
from django import forms
from django.utils.translation import ugettext as _
from django.shortcuts import redirect
from django.http import JsonResponse
from bs4 import BeautifulSoup
import http.cookies
import urllib.request
import requests
import mysql.connector
import json
  
def olx_soup_append(kkeyword,link,results):
    prom_res = {}
    soup_main = BeautifulSoup(urllib.request.urlopen(link), features="html.parser")
    soup = soup_main.find('table', {'class': 'fixed offers breakword redesigned'})
    if soup:
        soup = soup.find_all('tr', {'class': 'wrap'})
        for obj in soup:
            try:
                prom_res['nrno'] = len(results)+1
                prom_res['keyword'] = kkeyword

                try:
                    prom_res['title'] = obj.select('a.marginright5.link.linkWithHash')[0].get_text().replace('\n','').strip(' ')
                except:
                    prom_res['title']="Title Error-Fix Me"

                try:
                    prom_res['image_link'] = obj.find('img', {'class': 'fleft'})['src'].replace('\n','').strip(' ')
                except:
                    prom_res['image_link']="https://gmtools.co.uk/wp-content/uploads/2014/12/blank-banner-200x200.jpg"
                
                try:
                    prom_res['app_link'] = obj.select('a.marginright5.link.linkWithHash')[0].get('href')
                except:
                    prom_res['app_link']="app_link Error-Fix Me"

                try:
                    prom_res['price'] = obj.find('p', {'class': 'price'}).get_text().replace('\n','').strip(' ')
                    prom_res['sortprice'] = prom_res['price'].replace(" ", "")[:-1]
                except:
                    prom_res['price']="priceERR"
                    prom_res['sortprice']="priceERR"

                try:
                    prom_res['location'] = obj.find('div', {'class': 'space rel'}).find('p',{'class':'lheight16'}, recursive=False).get_text().replace('\n','').strip(' ')
                except:
                    prom_res['location']="location Error-Fix Me"
                                
                if prom_res != {}:
                    results.append(prom_res)
                prom_res = {}                    
            except:
                print("Error in table loop")
                pass
        try:
            nextlink = soup_main.select('a[data-cy="page-link-next"]')[0]
            print("trying next page, counter=",len(results))
            olx_soup_append(kkeyword,nextlink.get('href'),results)
            del nextlink
        except:
            print("no next page found")
            pass

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
    print(al)


    for word in al:
        try:
            kkeyword=word['word']
            link = urllib.request.Request(word['url'], headers={'User-Agent': 'Mozilla/5.0'})
            olx_soup_append(kkeyword,link,results)
        except:
            print("An exception occurred-main loop")
        
    return render(request, 'results.html', {'results': results, 'rang': len(results)})

def form_search_page(request):
    return render(request, 'searchform.html')