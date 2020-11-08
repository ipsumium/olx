import pandas as pd
import os
import json

print(os.getcwd())
df=pd.read_excel('map/zonare.xlsx',header=None,index_col=0)

zone=df.index.values.tolist()
clist=[]
toate_strazile=[]

for index,it in enumerate(df.values.tolist()):
    lista_strazi= [x for x in it if str(x)!='nan']
    clist.append({'zona':zone[index],'strazi':'\n'.join(lista_strazi)})
    toate_strazile.extend(lista_strazi)

print('initial=',len(toate_strazile))
toate_strazile=list(dict.fromkeys(toate_strazile))
print('final=',len(toate_strazile))

clist.append({'zona':'Toate','strazi':'\n'.join(toate_strazile)})

with open('map/zone.json', 'w') as filehandle:
    json.dump(clist, filehandle)