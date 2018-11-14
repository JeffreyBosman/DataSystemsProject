##############################################################################
## Importing
##############################################################################

from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
import time 
import pandas as pd
import re


##############################################################################
## SETUP
##############################################################################
brandweerarray=[]
ambuarray=[]
politiearray=[]
aantal_oproepen = 45 ## moet veelvoud van 15 zijn



##############################################################################
## LOOP
##############################################################################

for i in range(0, aantal_oproepen, 15): 
    theurl = 'http://www.112-nederland.nl/alerts/regiodetails.aspx?from=' +str(i) +'&vreg=5168&name=Amsterdam-Amstelland'
    #print(theurl)
    
    uClient = uReq(theurl)
    page_html = uClient.read()
    uClient.close()
    soup = BeautifulSoup(page_html,'lxml')

    brandweer = soup.find('div', id="alert-brandweer")
    tags= brandweer.findAll('h4',{'class':'media-heading'})
    for t in tags:
 #  print(str(t.text))
        brandweerarray.append(str(t.text))
    
    ambu = soup.find('div', id="alert-ambulance")
    tags= ambu.findAll('h4',{'class':'media-heading'})
    for t in tags:
#   print(str(t.text))
        ambuarray.append(str(t.text))
    
    time.sleep(6)
    print(str(((aantal_oproepen - i)/15) *8 /60) + ' minuten gaat dit nog duren' )
    
    
    
      
    
len(brandweerarray)  
len(ambuarray) 
