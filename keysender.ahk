#NoTrayIcon
#Persistent
#SingleInstance off
com=%1%
if (com = "next"){
Send {Right}
ExitApp
}
if (com = "prev"){
Send {Left}
ExitApp
}
if (com = "blank"){
Send b
ExitApp
}
if (com = "start"){
Send {F5}
ExitApp
}
if (com = "end"){
Send {Esc}
ExitApp
}
