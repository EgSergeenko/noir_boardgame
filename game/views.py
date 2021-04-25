from django.shortcuts import render, redirect
from django.core.cache import cache
from django.contrib.auth import login as auth_login
from django.contrib.auth.models import User
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import authenticate

from game.room import Room


def room(request, room_name):
    if not request.user.is_authenticated:
        return redirect('login/')
    if room_name not in cache.get_or_set('rooms', {}, None).keys():
        return redirect('lobby/')
    current_rooms = cache.get('rooms')
    current_room = current_rooms[room_name]
    username = request.user.username
    if room_name in cache.get_or_set('games', {}, None).keys():
        current_game = cache.get('games')[room_name]
        if username in current_game.players:
            return render(request, 'gamePage.html', {
                'room_name': room_name
            })
    if username in current_room.current_players:
        return redirect('lobby/')
    if current_room.is_full and username not in current_room.current_players:
        return redirect('lobby/')
    return render(request, 'gamePage.html', {
        'room_name': room_name
    })


def lobby(request):
    exists = False
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('/login/')
        room_name = request.POST.get('room_name')
        players_number = int(request.POST.get('players_number')[0])
        current_rooms = cache.get_or_set('rooms', {}, None)
        if room_name in current_rooms.keys():
            exists = True
            return render(request, 'game/lobby.html',
                          context={'current_rooms': current_rooms, 'exists': exists})
        new_room = Room(room_name, players_number)
        if len(current_rooms) == 0:
            cache.set('rooms', {room_name: new_room}, None)
        else:
            current_rooms[room_name] = new_room
            cache.set('rooms', current_rooms, None)

        return redirect(f'/{room_name}')

    current_rooms = cache.get_or_set('rooms', {}, None)
    return render(request, 'game/lobby.html',
                  context={'current_rooms': current_rooms, 'exists': exists})


def login(request):
    if request.user.is_authenticated:
        return redirect('/logout/')
    wrong = False
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            username = User.objects.get(email=username).username
        except User.DoesNotExist:
            wrong = True
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            request.session['user_id'] = user.id
            request.session.save()
            return redirect('/lobby/')
        else:
            wrong = True
    return render(request, 'game/login.html', context={"wrong": wrong})


def signup(request):
    if request.user.is_authenticated:
        return redirect('/logout/')
    exists = False
    passwords_mismatch = False
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        password_confirmation = request.POST.get('password_confirmation')
        if password_confirmation != password:
            passwords_mismatch = True
            return render(request, 'game/signup.html',
                          context={'passwords_mismatch': passwords_mismatch, 'exists': exists})
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None
        if user is None:
            user = User.objects.create_user(username=username,
                                            password=password)
            auth_login(request, user)
            return redirect('/lobby/')
        else:
            exists = True
    return render(request, 'game/signup.html',
                  context={'passwords_mismatch': passwords_mismatch, 'exists': exists})


def logout(request):
    if not request.user.is_authenticated:
        return redirect('/login/')
    if request.method == 'POST':
        auth_logout(request)
        return redirect('/login/')
    return render(request, 'game/logout.html')


def index(request):
    return redirect('/lobby/')
