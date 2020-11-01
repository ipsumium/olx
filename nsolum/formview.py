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
    return render(request, 'searchform.html')