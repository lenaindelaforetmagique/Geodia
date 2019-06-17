GeoProj
=======

https://fr.wikipedia.org/wiki/G%C3%A9ode_(g%C3%A9om%C3%A9trie)



A nice viewer for [Map projections][MapProjwikipedia].

**[See it here!](https://lenaindelaforetmagique.github.io/Geoproj/)**

## Screenshot!

![Screenshot](screenshot.png)

## Controls

### Mouse
- click & move : slide the view.
- wheel : zoom in/out.
- SHIFT + click & move : change center of projection.

### Keyboard
- left/right arrow to change projection.
- s/f : change longitude center of projection.
- d/e : change latitude center of projection.

### Touch
- two-fingers-move : like any photo viewer : slide + zoom.
- one-finger-move : change center of projection.
- one-finger-click :
  - left-quarter of the screen : previous projection.
  - right-quarter of the screen : next projection.

### Query string
Query argument may be added to URL after '?':
- file=fileName.json : a "well" formated geojson file.
- animated=true/false : specifies animation.
- p=int : a integer to specify the projection to show (number of changings from default position (may be negative))


## List of computed projections
A [list of numerous map projections][MapProjListwikipedia].

The list of map projections computed here:
- Orthographic
- Equirectangular
- Mercator
- Bonne
- Gall-stereographic
- Lambert-cylindrical
- Eckert II
- Sinusoidal
- Mollweide
- Winkel-Tripel
- Stereographic
- Azimuthal equidistant
- Lambert conformal conic


<!-- ## Coastlines

Earth coastlines

earth-coastline-12.json : 12.5%
earth-coastline-25.json : 25%
earth-coastline-50.json : 50%
earth-coastline-100.json : 100% -->


License
=======

_Geoproj_ is licensed under the [MIT License](LICENSE). Distribute and modify at will!

Coastlines data come from [geo-maps](https://github.com/simonepri/geo-maps), MIT License.

Ubuntu Mono font from [Google Fonts](https://fonts.google.com/specimen/Ubuntu+Mono), distributed under the [SIL Open Font License, 1.1](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).


[MapProjwikipedia]:https://en.wikipedia.org/wiki/Map_projection
[MapProjListwikipedia]:https://en.wikipedia.org/wiki/List_of_map_projections
