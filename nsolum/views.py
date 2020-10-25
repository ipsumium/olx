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
  
def search_page(request):
    al = []
    results = []

    with open('nsolum/input_file.txt', 'r') as f:
        for line in f:
            key_words = {}
            line = line.replace(' ', '-').replace('\n', '')
            key_words['word'] = line
            key_words['url'] = "https://www.olx.ro/imobiliare/case-de-vanzare/bucuresti/q-"+str(line.strip('\n'))+"/?search%5Bfilter_float_price%3Afrom%5D=20000&search%5Bfilter_float_price%3Ato%5D=120000&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc"
            al.append(key_words)
        f.close()

    for word in al:
        prom_res = {}
        try:
            link = urllib.request.Request(word['url'], headers={'User-Agent': 'Mozilla/5.0'})
            soup = BeautifulSoup(urllib.request.urlopen(link), features="html.parser")
            soup = soup.find('table', {'class': 'fixed offers breakword redesigned'})
            if soup:
                soup = soup.find_all('tr', {'class': 'wrap'})
                counter = 1
                for obj in soup:
                    try:
                        prom_res['nrno'] = counter
                        counter = counter + 1
                        prom_res['title'] = obj.find('a', {'class': 'marginright5 link linkWithHash detailsLink'}).get_text().replace('\n','').strip(' ')
                        prom_res['image_link'] = obj.find('img', {'class': 'fleft'})['src'].replace('\n','').strip(' ')
                        prom_res['app_link'] = obj.find('a', {'class': 'marginright5 link linkWithHash detailsLink'})['href']
                        prom_res['price'] = obj.find('p', {'class': 'price'}).get_text().replace('\n','').strip(' ')
                        #prom_res['location'] = obj.find('div', {'class': 'space rel'}).get_text().replace('\n','').strip(' ')
                        prom_res['location'] = obj.find('div', {'class': 'space rel'}).find('p',{'class':'lheight16'}, recursive=False).get_text().replace('\n','').strip(' ')
                        
                        if prom_res != {}:
                            results.append(prom_res)
                        prom_res = {}
                    except AttributeError:
                        pass
        except:
            print("An exception occurred")
        
    return render(request, 'results.html', {'results': results, 'rang': len(results)})