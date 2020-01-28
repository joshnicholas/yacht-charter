import makeTooltip from "./tooltip"
import createCats from "./key"

export default class TreeMap {
  constructor(data, d3) {

    var width = document.querySelector("#graphicContainer").getBoundingClientRect().width
    //golden ratio
    var height = width * 0.61803398875

    var treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true)

    const svg = d3.select("#graphicContainer")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif")

    // insert a single root node
    const dataWithRoot = [{
        categoryName: "root",
        categoryParent: "",
      },
      ...data
    ]

    var root = d3.stratify()
      .id(function (d) {
        return d.categoryName
      })
      .parentId(function (d) {
        if (d.categoryName != "root") {
          // Point any node without a parent to our single root node needed for
          // the d3 treemap method.
          if (d.categoryParent == null || d.categoryParent == "") {
            return "root"
          } else {
            return d.categoryParent
          }
        } else {
          return null
        }
      })(dataWithRoot)
      .sum(function (d) {
        return d.categorySize
      })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value
      })

    treemap(root)

    console.log(root)

    let nonLeafs = root.descendants().filter(
      treeNode => {
        return treeNode.count().value != 1 && treeNode.id != "root"
      }
    )


    let keyNames = nonLeafs.map(
      nonLeafNode => {
        return nonLeafNode.data.categoryName
      }
    )

    let keyColors = nonLeafs.map(
      nonLeafNode => {
        return nonLeafNode.data.categoryColorOverride
      }
    )

    createCats(d3, keyNames, keyColors)

    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", function (d) {
        return "translate(" + d.x0 + "," + d.y0 + ")"
      })

    leaf.append("title")
      .text(d => d.data.categoryName)

    var cell = svg.selectAll("a")
      .data(root.leaves())
      .enter().append("a")
      .attr("target", "_blank")
      .attr("transform", function (d) {
        return "translate(" + d.x0 + "," + d.y0 + ")"
      })

    cell.append("rect")
      .attr("id", function (d) {
        return d.id
      })
      .attr("width", function (d) {
        return d.x1 - d.x0
      })
      .attr("height", function (d) {
        return d.y1 - d.y0
      })
      .attr("fill", function (d) {
        //default color if overrides are set incorrectly
        var color = "#bada55"
        var node = d
        if (node.data.categoryColorOverride == null ||
          node.data.categoryColorOverride == "") {

          while (node.parent != null &&
            node.data.categoryColorOverride == null ||
            node.data.categoryColorOverride == "") {
            // inherit parent category color
            color = node.parent.data.categoryColorOverride
            node = node.parent
          }

        } else {
          color = node.data.categoryColorOverride
        }

        return color
      })
    makeTooltip("rect", root.leaves(), d3)

    cell.append("clipPath")
      .attr("id", function (d) {
        return "clip-" + d.id
      })
      .append("use")
      .attr("xlink:href", function (d) {
        return "#" + d.id
      })

    var label = cell.append("text")
      .attr("id", function (d) {
        return "text-" + d.id
      })
      .attr("clip-path", function (d) {
        return "url(#clip-" + d.id + ")"
      })

    makeTooltip("clip-path", root.leaves(), d3)

    label
      .attr("x", 4)
      .attr("y", 13)
      .text(function (d) {
        return d.id
      })

    this._wrap(label, d3)

    label.attr("opacity", function () {
      let textWidth = this.parentNode
        .getBBox()
        .width
      let rectWidth = d3.select(this.parentNode)
        .select("rect")
        .node()
        .getBBox()
        .width

      let textHeight = this.parentNode
        .getBBox()
        .height
      let rectHeight = d3.select(this.parentNode)
        .select("rect")
        .node()
        .getBBox()
        .height

      if (textWidth > rectWidth || textHeight > rectHeight) {
        return 0
      } else {
        return 1
      }
    })
  }

  _wrap(text, d3) {
    text.each(function () {
      let rectWidth = d3.select(this.parentNode)
        .select("rect")
        .node()
        .getBBox()
        .width - 8 // padding
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word = words.pop(),
        line = [],
        y = text.attr("y"),
        dy = 0,
        tspan = text.text(null).append("tspan").attr("x", 4).attr("y", y).attr("dy", dy + "em")

      var lineNumber = 0
      while (word != null) {
        const lineHeight = 1.1
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node().getComputedTextLength() > rectWidth) {
          lineNumber += 1
          line.pop()
          tspan.text(line.join(" "))
          line = [word]
          tspan = text.append("tspan").attr("x", 4).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(word)
        }
        word = words.pop()
      }
    })
  }
}