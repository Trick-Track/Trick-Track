from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.models import User, auth
import json

def json_decode(request):
  if request.method == 'POST':
    json.loads(request.body.decode("utf-8"))
    json_data = json.loads(request.body)
    print(json_data)
    return HttpResponse('POST')

    # do your thing

def index(request):
    return render(request, 'daw/index.html')

# def login(request):
    # return redirect('accounts/login')

def retrieve_user_projects(request):
    # return redirect('/')
    # pass
    # return index(request)
    return redirect('/')

def user_projects(request):
    if request.method == 'POST':
        print("Oh I've GOT SOMETHING")
        return HttpResponse('POST')
    elif request.method == 'GET':
        return HttpResponse('GET')

def user_project(request, id=id):
    if request.method == 'POST':
        return HttpResponse('POST')
    elif request.method == 'GET':
        return HttpResponse('GET')


