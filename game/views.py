from django.shortcuts import render, redirect
from django.core.cache import cache
from django.contrib.auth import login as auth_login
from django.contrib.auth.models import User
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
            return render(request, 'game/game_room.html', {
                'room_name': room_name
            })
    if current_room.is_full:
        return redirect('lobby/')
    return render(request, 'game/game_room.html', {
        'room_name': room_name
    })


def lobby(request):
    if request.method == 'POST':
        room_name = request.POST.get('room_name')
        players_number = int(request.POST.get('players_number'))
        new_room = Room(room_name, players_number)
        current_rooms = cache.get('rooms')
        if current_rooms is None:
            cache.set('rooms', {room_name: new_room}, None)
        else:
            current_rooms[room_name] = new_room
            cache.set('rooms', current_rooms, None)

        return redirect(f'/{room_name}')

    current_rooms = cache.get_or_set('rooms', {}, None)
    print(current_rooms)
    return render(request, 'game/lobby.html', context={'current_rooms': current_rooms})


def login(request):
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
    exists = False
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            user = None
        if user is None:
            user = User.objects.create_user(username=username,
                                            password=password,
                                            email=username)
            auth_login(request, user)
            request.session['user_id'] = user.id
            request.session.save()
            return redirect('/lobby/')
        else:
            exists = True
    return render(request, 'game/signup.html', context={'exists': exists})
