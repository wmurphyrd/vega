import { Spec } from 'vega';

export const spec: Spec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "padding": 10,
  "config": {
    "axis": {
      "tickColor": "#ccc"
    }
  },

  "signals": [
    { "name": "chartSize", "value": 120 },
    { "name": "chartPad", "value": 15 },
    { "name": "chartStep", "update": "chartSize + chartPad" },
    { "name": "width", "update": "chartStep * 4" },
    { "name": "height", "update": "chartStep * 4" },
    {
      "name": "cell", "value": null,
      "on": [
        {
          "events": "@cell:mousedown", "update": "group()"
        },
        {
          "events": "@cell:mouseup",
          "update": "!span(brushX) && !span(brushY) ? null : cell"
        }
      ]
    },
    {
      "name": "brushX", "value": 0,
      "on": [
        {
          "events": "@cell:mousedown",
          "update": "[x(cell), x(cell)]"
        },
        {
          "events": "[@cell:mousedown, window:mouseup] > window:mousemove",
          "update": "[brushX[0], clamp(x(cell), 0, chartSize)]"
        },
        {
          "events": {"signal": "delta"},
          "update": "clampRange([anchorX[0] + delta[0], anchorX[1] + delta[0]], 0, chartSize)"
        }
      ]
    },
    {
      "name": "brushY", "value": 0,
      "on": [
        {
          "events": "@cell:mousedown",
          "update": "[y(cell), y(cell)]"
        },
        {
          "events": "[@cell:mousedown, window:mouseup] > window:mousemove",
          "update": "[brushY[0], clamp(y(cell), 0, chartSize)]"
        },
        {
          "events": {"signal": "delta"},
          "update": "clampRange([anchorY[0] + delta[1], anchorY[1] + delta[1]], 0, chartSize)"
        }
      ]
    },
    {
      "name": "down", "value": [0, 0],
      "on": [{"events": "@brush:mousedown", "update": "[x(cell), y(cell)]"}]
    },
    {
      "name": "anchorX", "value": null,
      "on": [{"events": "@brush:mousedown", "update": "slice(brushX)"}]
    },
    {
      "name": "anchorY", "value": null,
      "on": [{"events": "@brush:mousedown", "update": "slice(brushY)"}]
    },
    {
      "name": "delta", "value": [0, 0],
      "on": [
        {
          "events": "[@brush:mousedown, window:mouseup] > window:mousemove",
          "update": "[x(cell) - down[0], y(cell) - down[1]]"
        }
      ]
    },
    {
      "name": "rangeX", "value": [0, 0],
      "on": [
        {
          "events": {"signal": "brushX"},
          "update": "invert(cell.datum.x.data + 'X', brushX)"
        }
      ]
    },
    {
      "name": "rangeY", "value": [0, 0],
      "on": [
        {
          "events": {"signal": "brushY"},
          "update": "invert(cell.datum.y.data + 'Y', brushY)"
        }
      ]
    },
    {
      "name": "cursor", "value": "'default'",
      "on": [
        {
          "events": "[@cell:mousedown, window:mouseup] > window:mousemove!",
          "update": "'nwse-resize'"
        },
        {
          "events": "@brush:mousemove, [@brush:mousedown, window:mouseup] > window:mousemove!",
          "update": "'move'"
        },
        {
          "events": "@brush:mouseout, window:mouseup",
          "update": "'default'"
        }
      ]
    }
  ],

  "data": [
    {
      "name": "iris",
      "url": "data/iris.json"
    },
    {
      "name": "fields",
      "values": ["petalWidth", "petalLength", "sepalWidth", "sepalLength"]
    },
    {
      "name": "cross",
      "source": "fields",
      "transform": [
        { "type": "cross", "as": ["x", "y"] },
        { "type": "formula", "as": "xscale", "expr": "datum.x.data + 'X'" },
        { "type": "formula", "as": "yscale", "expr": "datum.y.data + 'Y'" }
      ]
    }
  ],

  "scales": [
    {
      "name": "groupx",
      "type": "band",
      "range": "width",
      "domain": {"data": "fields", "field": "data"}
    },
    {
      "name": "groupy",
      "type": "band",
      "range": [{"signal": "height"}, 0],
      "domain": {"data": "fields", "field": "data"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "iris", "field": "species"},
      "range": "category"
    },

    {
      "name": "petalWidthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petalWidth"},
      "range": [0, {"signal": "chartSize"}]
    },
    {
      "name": "petalLengthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petalLength"},
      "range": [0, {"signal": "chartSize"}]
    },
    {
      "name": "sepalWidthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepalWidth"},
      "range": [0, {"signal": "chartSize"}]
    },
    {
      "name": "sepalLengthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepalLength"},
      "range": [0, {"signal": "chartSize"}]
    },

    {
      "name": "petalWidthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petalWidth"},
      "range": [{"signal": "chartSize"}, 0]
    },
    {
      "name": "petalLengthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petalLength"},
      "range": [{"signal": "chartSize"}, 0]
    },
    {
      "name": "sepalWidthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepalWidth"},
      "range": [{"signal": "chartSize"}, 0]
    },
    {
      "name": "sepalLengthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepalLength"},
      "range": [{"signal": "chartSize"}, 0]
    }
  ],

  "axes": [
    {
      "orient": "left", "scale": "petalWidthY", "minExtent": 25,
      "title": "Petal Width", "tickCount": 5, "domain": false,
      "position": {"signal": "3 * chartStep"}
    },
    {
      "orient": "left", "scale": "petalLengthY", "minExtent": 25,
      "title": "Petal Length", "tickCount": 5, "domain": false,
      "position": {"signal": "2 * chartStep"}
    },
    {
      "orient": "left", "scale": "sepalWidthY", "minExtent": 25,
      "title": "Sepal Width", "tickCount": 5, "domain": false,
      "position": {"signal": "1 * chartStep"}
    },
    {
      "orient": "left", "scale": "sepalLengthY", "minExtent": 25,
      "title": "Sepal Length", "tickCount": 5, "domain": false
    },
    {
      "orient": "bottom", "scale": "petalWidthX",
      "title": "Petal Width", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}
    },
    {
      "orient": "bottom", "scale": "petalLengthX",
      "title": "Petal Length", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}, "position": {"signal": "1 * chartStep"}
    },
    {
      "orient": "bottom", "scale": "sepalWidthX",
      "title": "Sepal Width", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}, "position": {"signal": "2 * chartStep"}
    },
    {
      "orient": "bottom", "scale": "sepalLengthX",
      "title": "Sepal Length", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}, "position": {"signal": "3 * chartStep"}
    }
  ],

  "legends": [
    {
      "fill": "color",
      "title": "Species",
      "offset": 0,
      "encode": {
        "symbols": {
          "update": {
            "fillOpacity": {"value": 0.5},
            "stroke": {"value": "transparent"}
          }
        }
      }
    }
  ],

  "marks": [
    {
      "type": "rect",
      "encode": {
        "enter": {
          "fill": {"value": "#eee"}
        },
        "update": {
          "opacity": {"signal": "cell ? 1 : 0"},
          "x": {"signal": "cell ? cell.x + brushX[0] : 0"},
          "x2": {"signal": "cell ? cell.x + brushX[1] : 0"},
          "y": {"signal": "cell ? cell.y + brushY[0] : 0"},
          "y2": {"signal": "cell ? cell.y + brushY[1] : 0"}
        }
      }
    },
    {
      "name": "cell",
      "type": "group",
      "from": {"data": "cross"},

      "encode": {
        "enter": {
          "x": {"scale": "groupx", "field": "x.data"},
          "y": {"scale": "groupy", "field": "y.data"},
          "width": {"signal": "chartSize"},
          "height": {"signal": "chartSize"},
          "fill": {"value": "transparent"},
          "stroke": {"value": "#ddd"}
        }
      },

      "marks": [
        {
          "type": "symbol",
          "from": {"data": "iris"},
          "interactive": false,
          "encode": {
            "enter": {
              "x": {
                "scale": {"parent": "xscale"},
                "field": {"datum": {"parent": "x.data"}}
              },
              "y": {
                "scale": {"parent": "yscale"},
                "field": {"datum": {"parent": "y.data"}}
              },
              "fillOpacity": {"value": 0.5},
              "size": {"value": 36}
            },
            "update": {
              "fill": [
                {
                  "test": "!cell || inrange(datum[cell.datum.x.data], rangeX) && inrange(datum[cell.datum.y.data], rangeY)",
                  "scale": "color", "field": "species"
                },
                {"value": "#ddd"}
              ]
            }
          }
        }
      ]
    },
    {
      "type": "rect",
      "name": "brush",
      "encode": {
        "enter": {
          "fill": {"value": "transparent"}
        },
        "update": {
          "x": {"signal": "cell ? cell.x + brushX[0] : 0"},
          "x2": {"signal": "cell ? cell.x + brushX[1] : 0"},
          "y": {"signal": "cell ? cell.y + brushY[0] : 0"},
          "y2": {"signal": "cell ? cell.y + brushY[1] : 0"}
        }
      }
    }
  ]
};
