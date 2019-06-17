// MIT License
//
// Copyright (c) 2018 Xavier Morin
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Main script.

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}


let u_ = new Universe();

// reading of .JSON file
// var request = new XMLHttpRequest();
// request.onload = function() {
//   var coastlines = request.response;
//
//   var multiPolygons = getGeoJsonObj(coastlines, "MultiPolygon");
//   var polygons = getGeoJsonObj(coastlines, "Polygon");
//   for (let i = 0; i < polygons.length; i++) {
//     multiPolygons.push([polygons[i]]);
//   }
//
//   function success(pos) {
//     var crd = pos.coords;
//     var run = new HTMLView(multiPolygons, [crd.longitude, crd.latitude], animated, projnum);
//   }
//
//   function error(err) {
//     var run = new HTMLView(multiPolygons, [0, 0], animated, projnum);
//   }
//
//   navigator.geolocation.getCurrentPosition(success, error);
// }

// function getGeoJsonObj(o, type) {
//   // returns an Arry of every type-objects
//   if (o.type == type) {
//     return o.coordinates;
//   } else {
//     let r = [];
//     for (var p in o) {
//       if (typeof(o[p]) == "object") {
//         r = r.concat(getGeoJsonObj(o[p], type));
//       }
//     }
//     return r;
//   }
// }

// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();