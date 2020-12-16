"use strict";function ownKeys(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),i.push.apply(i,r)}return i}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(i),!0).forEach(function(e){(0,_defineProperty2.default)(t,e,i[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):ownKeys(Object(i)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))})}return t}function getLongestKeyLength(t,e,i){if(!i){d3.select("#dummyText").remove();var r=e.sort(function(t,e){return e.length-t.length})[0];return t.append("text").attr("x",-50).attr("y",-50).attr("id","dummyText").attr("class","annotationText").text(r).node().getBBox().width}return 0}var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_numberFormat=require("../utilities/numberFormat"),_mustache=_interopRequireDefault(require("../utilities/mustache")),_helpers=_interopRequireDefault(require("../utilities/helpers")),_dataTools=_interopRequireDefault(require("./dataTools")),_tooltip=_interopRequireDefault(require("./shared/tooltip")),_colorscale=_interopRequireDefault(require("./shared/colorscale")),LineChart=function(){function t(e){(0,_classCallCheck2.default)(this,t);var i=JSON.parse(JSON.stringify(e));this.data=i.sheets.data,this.keys=Object.keys(this.data[0]),this.xColumn=this.keys[0],this.keys.splice(0,1),this.template=i.sheets.template,this.meta=this.template[0],this.labels=i.sheets.labels,this.periods=i.sheets.periods,this.userKey=i.sheets.key,this.options=i.sheets.options,this.tooltipTemplate=this.meta.tooltip,this.hasTooltipTemplate=!(!this.tooltipTemplate||""==this.tooltipTemplate),this.tooltip=new _tooltip.default("#graphicContainer"),this.x_axis_cross_y=null,this.colors=new _colorscale.default,this.$svg=null,this.$features=null,this.$chartKey=d3.select("#chartKey");var r=Math.max(document.documentElement.clientWidth,window.innerWidth||0);this.isMobile=r<610,this.containerWidth=document.querySelector("#graphicContainer").getBoundingClientRect().width,console.log("containerWidth",this.containerWidth),this.margin={top:0,right:0,bottom:20,left:40},this.width=this.containerWidth-this.margin.left-this.margin.right,this.height=.6*this.containerWidth-this.margin.top-this.margin.bottom,this.y=d3.scaleLinear().rangeRound([this.height,0]),this.xAxis=null,this.yAxis=null,this.min=null,this.max=null,this.lineGenerators={},this.parseTime=null,this.parsePeriods=null,this.hideNullValues="yes",this.chartValues=[],this.chartKeyData={},this.setup(),this.render()}return(0,_createClass2.default)(t,[{key:"setup",value:function(){var t=this;d3.select("#graphicContainer svg").remove(),this.$chartKey.html(""),d3.select("#chartTitle").text(this.meta.title),d3.select("#subTitle").text(this.meta.subtitle),""!=this.meta.source&&d3.select("#sourceText").html(" | Source: "+this.meta.source);var e=_dataTools.default.getKeysColors({keys:this.keys,userKey:this.userKey,option:this.options[0]});this.colors.set(e.keys,e.colors),this.meta.x_axis_cross_y&&""!=this.meta.x_axis_cross_y&&(this.x_axis_cross_y=+this.meta.x_axis_cross_y),this.meta["margin-top"]&&(this.margin={top:+this.meta["margin-top"],right:+this.meta["margin-right"],bottom:+this.meta["margin-bottom"],left:+this.meta["margin-left"]}),this.meta.breaks&&(this.hideNullValues=this.meta.breaks),this.meta.xColumn&&(this.xColumn=this.meta.xColumn,this.keys.splice(this.keys.indexOf(this.xColumn),1)),this.meta.yScaleType&&(this.y=d3[this.meta.yScaleType]().range([this.height,0]).nice()),this.parseTime=d3.timeParse(this.meta.dateFormat),this.parsePeriods=d3.timeParse(this.meta.periodDateFormat),console.log("containerWidth",this.containerWidth),console.log("width",this.width),console.log("margin",this.margin),this.$svg=d3.select("#graphicContainer").append("svg").attr("width",this.width+this.margin.left+this.margin.right).attr("height",this.height+this.margin.top+this.margin.bottom).attr("id","svg").attr("overflow","hidden"),this.margin.right=this.margin.right+getLongestKeyLength(this.$svg,this.keys,this.isMobile),this.width=this.containerWidth-this.margin.left-this.margin.right,this.$svg.attr("width",this.width+this.margin.left+this.margin.right),this.x=d3.scaleLinear().rangeRound([0,this.width]),"string"==typeof this.data[0][this.xColumn]&&(this.x=d3.scaleTime().rangeRound([0,this.width])),console.log("containerWidth",this.containerWidth),console.log("width",this.width),console.log("svgWidth",this.width+this.margin.left+this.margin.right),this.$features=this.$svg.append("g").attr("transform","translate("+this.margin.left+","+this.margin.top+")"),this.keys.forEach(function(e){t.lineGenerators[e]=d3.line().x(function(e){return t.x(e[t.xColumn])}).y(function(i){return t.y(i[e])}),"yes"===t.hideNullValues&&t.lineGenerators[e].defined(function(t){return t}),t.data.forEach(function(i){"string"==typeof i[e]?i[e].includes(",")?isNaN(i[e].replace(/,/g,""))||(i[e]=+i[e].replace(/,/g,""),t.chartValues.push(i[e])):""!=i[e]?isNaN(i[e])||(i[e]=+i[e],t.chartValues.push(i[e])):""==i[e]&&(i[e]=null):t.chartValues.push(i[e])})}),this.isMobile&&this.keys.forEach(function(e){var i=t.$chartKey.append("div").attr("class","keyDiv");i.append("span").attr("class","keyCircle").style("background-color",function(){return t.colors.get(e)}),i.append("span").attr("class","keyText").text(e)}),this.data.forEach(function(e){"string"==typeof e[t.xColumn]&&(e[t.xColumn]=t.parseTime(e[t.xColumn]))}),this.keys.forEach(function(e){t.chartKeyData[e]=[],t.data.forEach(function(i){if(null!=i[e]){var r={};r[t.xColumn]=i[t.xColumn],r[e]=i[e],t.chartKeyData[e].push(r)}else t.chartKeyData[e].push(null)})}),this.labels.forEach(function(e){"string"==typeof e.x&&(e.x=t.parseTime(e.x)),"string"==typeof e.y&&(e.y=+e.y),"string"==typeof e.offset&&(e.offset=+e.offset)}),this.periods.forEach(function(e){"string"==typeof e.start&&(e.start=t.parsePeriods(e.start),e.end=t.parsePeriods(e.end),e.middle=new Date((e.start.getTime()+e.end.getTime())/2))}),this.max=d3.max(this.chartValues),this.min=this.meta.minY&&""!==this.meta.minY?parseInt(this.meta.minY):d3.min(this.chartValues),this.x.domain(d3.extent(this.data,function(e){return e[t.xColumn]})),this.y.domain([this.min,this.max]);var i=this.isMobile?4:6,r="scaleLog"===this.meta.yScaleType?3:5;this.xAxis=d3.axisBottom(this.x).ticks(i),this.yAxis=d3.axisLeft(this.y).tickFormat(function(t){return(0,_numberFormat.numberFormat)(t)}).ticks(r)}},{key:"render",value:function(){var t=this;d3.selectAll(".periodLine").remove(),d3.selectAll(".periodLabel").remove(),this.$features.selectAll(".periodLine").data(this.periods).enter().append("line").attr("x1",function(e){return t.x(e.start)}).attr("y1",0).attr("x2",function(e){return t.x(e.start)}).attr("y2",this.height).attr("class","periodLine mobHide").attr("stroke","#bdbdbd").attr("opacity",function(e){return e.start<t.x.domain()[0]?0:1}).attr("stroke-width",1),this.$features.selectAll(".periodLine").data(this.periods).enter().append("line").attr("x1",function(e){return t.x(e.end)}).attr("y1",0).attr("x2",function(e){return t.x(e.end)}).attr("y2",this.height).attr("class","periodLine mobHide").attr("stroke","#bdbdbd").attr("opacity",function(e){return e.end>t.x.domain()[1]?0:1}).attr("stroke-width",1),this.$features.selectAll(".periodLabel").data(this.periods).enter().append("text").attr("x",function(e){return"middle"==e.labelAlign?t.x(e.middle):"start"==e.labelAlign?t.x(e.start)+5:void 0}).attr("y",-5).attr("text-anchor",function(t){return t.labelAlign}).attr("class","periodLabel mobHide").attr("opacity",1).text(function(t){return t.label}),this.$features.append("g").attr("class","x").attr("transform",function(){return null!=t.x_axis_cross_y?"translate(0,"+t.y(t.x_axis_cross_y)+")":"translate(0,"+t.height+")"}).call(this.xAxis),this.$features.append("g").attr("class","y").call(this.yAxis),this.$features.append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy","0.71em").attr("fill","#767676").attr("text-anchor","end").text(this.meta.yAxisLabel),this.$features.append("text").attr("x",this.width).attr("y",this.height-6).attr("fill","#767676").attr("text-anchor","end").text(this.meta.xAxisLabel),d3.selectAll(".tick line").attr("stroke","#767676"),d3.selectAll(".tick text").attr("fill","#767676"),d3.selectAll(".domain").attr("stroke","#767676"),this.keys.forEach(function(e){t.$features.append("path").datum(t.chartKeyData[e]).attr("fill","none").attr("stroke",function(i){return t.colors.get(e)}).attr("stroke-linejoin","round").attr("stroke-linecap","round").attr("stroke-width",2).attr("d",t.lineGenerators[e]);var i=t.chartKeyData[e].filter(function(t){return null!=t}),r="start",a=0;t.x(i[i.length-1].index)>t.width-20&&(r="end",a=-10),t.isMobile||(t.$features.append("circle").attr("cy",function(r){return t.y(i[i.length-1][e])}).attr("fill",function(i){return t.colors.get(e)}).attr("cx",function(e){return t.x(i[i.length-1][t.xColumn])}).attr("r",4).style("opacity",1),t.$features.append("text").attr("class","annotationText").attr("y",function(r){return t.y(i[i.length-1][e])+4+a}).attr("x",function(e){return t.x(i[i.length-1][t.xColumn])+5}).style("opacity",1).attr("text-anchor",r).text(function(t){return e}))}),this.hasTooltipTemplate&&this.drawHoverFeature(),this.drawAnnotation()}},{key:"drawHoverFeature",value:function(){var t=this,e=this,i=this.xColumn,r=this.$features.append("line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",this.height).style("opacity",0).style("stroke","#333").style("stroke-dasharray",4),a=function(e,r){var a=d3.bisector(function(t){return t[i]}).left,s=t.x.invert(d3.mouse(r)[0]),n=a(t.data,s,1),o=(0,_defineProperty2.default)({},i,s);return t.keys.forEach(function(r){var a=t.chartKeyData[r],l=a[n-1],h=a[n];e=l&&h&&s-l[i]>h[i]-s?h:l,o[r]=e[r]}),o},s=function(e,i){var r=a(e,i);return(0,_mustache.default)(t.tooltipTemplate,_objectSpread({},_helpers.default,{},r))};this.$features.append("rect").attr("width",this.width).attr("height",this.height).style("opacity",0).on("mousemove touchmove",function(t){var i=e.x.invert(d3.mouse(this)[0]),a=s(t,this);e.tooltip.show(a,e.width,e.height+e.margin.top+e.margin.bottom),r.attr("x1",e.x(i)).attr("x2",e.x(i)).style("opacity",.5)}).on("mouseout",function(){e.tooltip.hide(),r.style("opacity",0)})}},{key:"drawAnnotation",value:function(){function t(t){return t.offset>0?6:-2}function e(t){return t.offset>0?8:4}var i=this,r=d3.select("#footerAnnotations");r.html(""),this.$features.selectAll(".annotationLine").data(this.labels).enter().append("line").attr("class","annotationLine").attr("x1",function(t){return i.x(t.x)}).attr("y1",function(t){return i.y(t.y)}).attr("x2",function(t){return i.x(t.x)}).attr("y2",function(t){var e=i.y(t.offset);return e<=-15?-15:e}).style("opacity",1).attr("stroke","#000"),this.isMobile?(this.$features.selectAll(".annotationCircles").data(this.labels).enter().append("circle").attr("class","annotationCircle").attr("cy",function(e){return i.y(e.offset)+t(e)/2}).attr("cx",function(t){return i.x(t.x)}).attr("r",8).attr("fill","#000"),this.$features.selectAll(".annotationTextMobile").data(this.labels).enter().append("text").attr("class","annotationTextMobile").attr("y",function(t){return i.y(t.offset)+e(t)}).attr("x",function(t){return i.x(t.x)}).style("text-anchor","middle").style("opacity",1).attr("fill","#FFF").text(function(t,e){return e+1}),this.labels.length>0&&r.append("span").attr("class","annotationFooterHeader").text("Notes: "),this.labels.forEach(function(t,e){r.append("span").attr("class","annotationFooterNumber").text(e+1+" - "),e<i.labels.length-1?r.append("span").attr("class","annotationFooterText").text(t.text+", "):r.append("span").attr("class","annotationFooterText").text(t.text)})):this.$features.selectAll(".annotationText2").data(this.labels).enter().append("text").attr("class","annotationText2").attr("y",function(e){var r=i.y(e.offset);return r<=-10?-10:r+-1*t(e)}).attr("x",function(t){var e=i.y(t.offset),r=i.x(t.x);return e<=-10?r-5:r}).style("text-anchor",function(t){return t.align}).style("opacity",1).text(function(t){return t.text})}}]),t}();exports.default=LineChart;