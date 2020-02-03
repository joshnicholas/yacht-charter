import {
  ChartBuilder
} from "./modules/applet"


function getURLParams(paramName) {
  var params = ""
  if (top !== self) {
    params = window.location.search.substring(1).split("&")
  } else {
    params = window.parent.location.search.substring(1).split("&")
  }

  for (let i = 0; i < params.length; i++) {
    let val = params[i].split("=")
    if (val[0] == paramName) {
      return val[1]
    }
  }
  return null

}

const key = getURLParams("key")

//animated = "1evrvPdWq4ysFW5JrdtJLDG3hVPNjPDnBqNJtT-WZnRo"
//scatterplot = "1AsgU8YQCKI6DuzJ8Y1qh4-Y7YRuFZZQr8K-4gmbtffU"
//stackedbarchart = "1qcFgkC1KraIA1n1fNSJxDGBWiKMEdfnAEuwFgHKXGg4"
//annotatedbarchart = "1yHONV9cWG0V1Yg2EY2prdxx00Z0AgGqO-6Wr6HQTux0"
//treemap = "1COfrldSAXYIRwOrcKOBU0-h3jGths9psaR3kgdnXgrU"

new ChartBuilder(key)