Esecuzione di cloc per un confronto...

----------------------------------------------------
  PROGETTO: ./frameworks/pokedex-angular-v1
----------------------------------------------------
github.com/AlDanial/cloc v 2.06  T=0.13 s (435.4 files/s, 79778.6 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JSON                            10              0              0           8802
TypeScript                      35            144             43            927
Markdown                         1             23              0             36
HTML                             6              1              0             31
INI                              1              3              0             14
Dockerfile                       1             12             26             13
CSS                              1              0              1              1
-------------------------------------------------------------------------------
SUM:                            55            183             70           9824
-------------------------------------------------------------------------------


D:\BacaroProjects\Pokedex\pokedex-frontend>(
echo ----------------------------------------------------  
 echo   PROGETTO: ./frameworks/pokedex-next-v1  
 echo ----------------------------------------------------  
 cloc --exclude-dir=node_modules,dist,.angular,.next,.vercel,.svelte-kit ./frameworks/pokedex-next-v1  
 echo.
) 
----------------------------------------------------
  PROGETTO: ./frameworks/pokedex-next-v1
----------------------------------------------------
github.com/AlDanial/cloc v 2.06  T=0.68 s (53.1 files/s, 4206.9 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JSON                             3              0              0           1727
TypeScript                      23            102             60            798
Text                             1              1              0             41
Markdown                         1             13              0             23
CSS                              1              4              0             22
Dockerfile                       1             12             26             13
SVG                              5              0              0              5
JavaScript                       1              1              0              4
-------------------------------------------------------------------------------
SUM:                            36            133             86           2633
-------------------------------------------------------------------------------


D:\BacaroProjects\Pokedex\pokedex-frontend>(
echo ----------------------------------------------------  
 echo   PROGETTO: ./frameworks/pokedex-svelte-v1  
 echo ----------------------------------------------------  
 cloc --exclude-dir=node_modules,dist,.angular,.next,.vercel,.svelte-kit ./frameworks/pokedex-svelte-v1  
 echo.
) 
----------------------------------------------------
  PROGETTO: ./frameworks/pokedex-svelte-v1
----------------------------------------------------
github.com/AlDanial/cloc v 2.06  T=0.10 s (465.6 files/s, 33401.3 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JSON                             3              0              0           2004
Svelte                          23             92             45            870
TypeScript                      13             25             21            136
Text                             2              1              0             54
Markdown                         1             14              0             24
JavaScript                       1              2              3             15
Dockerfile                       1             12             26             13
HTML                             1              0              0             11
CSS                              1              0              0              3
SVG                              1              0              0              1
-------------------------------------------------------------------------------
SUM:                            47            146             95           3131
-------------------------------------------------------------------------------

