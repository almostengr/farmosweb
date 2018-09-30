Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Component:ZoomToSource',
  init: function(data) {
    var map = data.map;

    function getLayersFromObject(object) {
      var layersInside = new ol.Collection();

      object.getLayers().forEach(function(layer) {
        if (layer instanceof ol.layer.Group) {
          layersInside.extend(getLayersFromObject(layer).getArray());
        } else {
          if (typeof layer.getSource === 'function') {
            if (layer.getSource() !== 'null' && layer.getSource() instanceof ol.source.Vector) {
              layersInside.push(layer);
            }
          }
        }
      });

      return layersInside;
    }

    var calculateMaxExtent = function() {
      var maxExtent = ol.extent.createEmpty();

      layers.forEach(function (layer) {
        var source = layer.getSource();
        if (typeof source.getFeatures === 'function') {
          if (source.getFeatures().length !== 0) {
            ol.extent.extend(maxExtent, source.getExtent());
          }
        }
      });

      return maxExtent;
    };

    var zoomToSource = function(source) {
      if (!data.opt.process_once || !data.opt.processed_once) {
        data.opt.processed_once = true;

        var animate_options = {
          duration: data.opt.duration,
        }

        var maxExtent = calculateMaxExtent();
        if (!ol.extent.isEmpty(maxExtent)) {
          map.getView().fit(maxExtent, map.getSize());
        }

        if (data.opt.zoom !== 'disabled') {
          if (data.opt.zoom !== 'auto') {
            animate_options.zoom = data.opt.zoom
          } else {
            animate_options.zoom = map.getView().getZoom();
            if (data.opt.max_zoom !== undefined && data.opt.max_zoom > 0 && animate_options.zoom > data.opt.max_zoom) {
              animate_options.zoom = data.opt.max_zoom;
            }
          }
        }

        map.getView().animate(animate_options);
      }
    };

    var layers = getLayersFromObject(map);
    layers.forEach(function (layer) {
      var source = layer.getSource();

      // Only zoom to a source if it's in the configured list of sources.
      if (typeof data.opt.source[source.mn] !== 'undefined') {
        source.on('change', zoomToSource, source);
        if (typeof source.getFeatures === 'function') {
          if (source.getFeatures().length !== 0) {
            zoomToSource.call(source);
          }
        }
      }
    });
  }
});
