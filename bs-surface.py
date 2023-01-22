import requests
import re
from bs4 import BeautifulSoup
import json

#OLX
html = requests.get('https://www.olx.ro/d/oferta/vand-apartament-3-camere-strada-traian-IDfk2Jf.html?isPreviewActive=0&sliderIndex=1')
soup = BeautifulSoup(html.content, 'html.parser')
net_area=int(re.search(r'\d+', soup.select(".css-ox1ptj")[2].get_text().split(":", 1)[1]).group())
ad_id=int(re.search(r'\d+', soup.find("div", attrs={"data-cy": "ad-footer-bar-section"}).find("span").get_text()).group())

#STORIA ID
html = requests.get('https://www.storia.ro/ro/oferta/oportunitate-investitie-vil-istorica-cismigiu-0-comision-IDpuu6.html')
soup = BeautifulSoup(html.content, 'html.parser')
s = soup.find('script', type='application/json', id="__NEXT_DATA__")
json_object = json.loads(s.contents[0])
ad_id=json_object['props']['pageProps']['ad']['id']
net_area=json_object['props']['pageProps']['ad']['target']['Net_area']


#STORIA varianta 2
html = requests.get('https://www.storia.ro/ro/oferta/apartament-2-camere-de-vanzare-metrou-berceni-pasarela-IDqjlc.html')
soup = BeautifulSoup(html.content, 'html.parser')
surface = int(soup.find("div", attrs={"aria-label": "Suprafata utila (m²)"}).find_all("div")[1].get_text())
print(surface)




#OLX v2
html = requests.get('https://www.olx.ro/d/oferta/proprietar-apartament-2-camere-dacia-eminescu-IDfE7Q6.html#0d15b0eb3b')
soup = BeautifulSoup(html.content, 'html.parser')
ad_id=int(re.search(r'\d+', soup.find("div", attrs={"data-cy": "ad-footer-bar-section"}).find("span").get_text()).group())

for i in soup.select(".css-ox1ptj"):
    if "utila" in i.get_text():
        net_area=int(re.search(r'\d+',i.get_text()).group())

def olx_ad(soup):
    for i in soup.select(".css-ox1ptj"):
        if "utila" in i.get_text():
            net_area=int(re.search(r'\d+',i.get_text()).group())
    ad_id=int(re.search(r'\d+', soup.find("div", attrs={"data-cy": "ad-footer-bar-section"}).find("span").get_text()).group())
    return ad_id, net_area

def storia_ad(soup):
    json_object = json.loads(soup.find('script', type='application/json', id="__NEXT_DATA__").contents[0])
    ad_id=int(json_object['props']['pageProps']['ad']['id'])
    net_area=int(float(json_object['props']['pageProps']['ad']['target']['Net_area']))

    

html = requests.get('https://www.storia.ro/ro/oferta/daca-esti-colectionar-de-antichitati-hai-sa-ti-dau-un-pont-IDpFA7.html')
soup = BeautifulSoup(html.content, 'html.parser')
storia_ad(soup)