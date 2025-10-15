windows
```
for /d /r . %d in (node_modules) do @if exist "%d" rd /s /q "%d"
```

unix
```
```