Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Source:GoogleMaps',
  init: function(data) {

    var olMapDiv = jQuery(data.map.getViewport()).parent();
    var gmapDiv = jQuery('#gmap-' + olMapDiv.attr('id'));

    var gmap = new google.maps.Map(gmapDiv[0], {
      disableDefaultUI: true,
      keyboardShortcuts: false,
      draggable: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      streetViewControl: false,
      tilt: 0,
      mapTypeId: google.maps.MapTypeId[data.opt.mapTypeId] || 'roadmap'
    });
    gmapDiv.data('gmap', gmap);

    data.map.getView().on('change:center', function() {
      var center = ol.proj.transform(data.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
      gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    });
    var mapTypeId = gmap.getMapTypeId();
    data.map.getView().on('change:resolution', function() {
      gmap.setZoom(data.map.getView().getZoom());

      // If gmap won't zoom in any farther, switch to ROADMAP.
      if (gmap.getZoom() < data.map.getView().getZoom()) {
        gmap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      } else {
        gmap.setMapTypeId(mapTypeId);
      }
    });

    data.map.getView().setCenter(data.map.getView().getCenter());
    data.map.getView().dispatchEvent('change:center');

    data.map.getView().setZoom(data.map.getView().getZoom());
    data.map.getView().dispatchEvent('change:resolution');

    data.map.on('change:size', function() {
      google.maps.event.trigger(gmap, 'resize');
    });

    olMapDiv[0].parentNode.removeChild(olMapDiv[0]);
    gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv[0]);

    data.opt.state = false;
    return new ol.source.Tile(data.opt);
  },

  /**
   * Helper to access the gmap instance in a ol.Map.
   */
  getMap: function(map){
    var olMapDiv = jQuery(map.getViewport()).parent();
    return jQuery('#gmap-' + olMapDiv.attr('id')).data('gmap');
  },

  /**
   * Attaches the gmap API by loading the script.
   * Evaluates all google maps sources and uses the most complex set of settings.
   * Attention: It's not possible to have maps with different key, channel or
   * client parameters.
   */
  scriptLoading: false,
  attach: function(context, settings) {
    // There seem cases in which google is already defind, but the loading isn't
    // finished, so make sure we'll wait till the loading is complete before
    // calling the initialize function ourselves.
    if (Drupal.openlayers.pluginManager.getPlugin('openlayers.Source:GoogleMaps').scriptLoading) {
      return;
    }
    if (typeof google === 'undefined') {
      Drupal.openlayers.pluginManager.getPlugin('openlayers.Source:GoogleMaps').scriptLoading = true;

      var params = {
        v: 3.29,
        callback: 'Drupal.openlayers.openlayers_source_internal_googlemaps_initialize'
      };

      // Collect all google API settings.
      jQuery('.openlayers.gmap-map').each(function(){
        var map_id = jQuery(this).attr('id').replace('gmap-', '');

        if (Drupal.settings.openlayers.maps[map_id] !== undefined) {
          jQuery.each(Drupal.settings.openlayers.maps[map_id].source, function(i, source){
            if (source.fs == 'openlayers.Source:GoogleMaps') {
              if (source.opt.channel) {
                params.channel = source.opt.channel;
              }
              if (source.opt.client) {
                params.client = source.opt.client;
              }
              if (source.opt.key) {
                params.key = source.opt.key;
              }
              if (source.opt.sensor) {
                params.sensor = 'true';
              }
            }
          });
        }
      });

      // Add the script with the collected settings.
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?' + jQuery.param(params);
      document.body.appendChild(script);
    }
    else {
      // Google API already available - initialize right away.
      Drupal.openlayers.openlayers_source_internal_googlemaps_initialize();
    }
  }
});


/**
 * Callback to initialize all google maps as soon as the gmap API is available.
 */
Drupal.openlayers.openlayers_source_internal_googlemaps_initialize = function() {
  Drupal.openlayers.pluginManager.getPlugin('openlayers.Source:GoogleMaps').scriptLoading = false;
  jQuery('.openlayers.gmap-map').each(function() {
    var map_id = jQuery(this).attr('id').replace('gmap-', '');
    var callback = Drupal.openlayers.asyncIsReadyCallbacks[map_id.replace(/[^0-9a-z]/gi, '_')];
    if (callback !== undefined) {
      callback();
    }
  });
};

/**
 * Ensure that maps loaded into invisible elements are refreshed properly.
 */
(function ($) {
  Drupal.behaviors.openlayers_source_googlemaps_refresh = {
    attach: function (context, settings) {

      // Refresh maps inside fieldsets when they are opened.
      $('fieldset:has(.openlayers-container)', context).bind('collapsed', function (e) {
        var fieldset = this;
        if (!e.value) {
          Drupal.behaviors.openlayers_source_googlemaps_refresh.map_refresh(fieldset);
        }
      });

      // Refresh maps inside Easy Responsive Tab when they are activated.
      var wrapper_class = '.field-group-easy-responsive-tabs-nav-wrapper';
      jQuery(wrapper_class + ' [role=tab]', context).on('tabactivate', function(e, tab) {
        var map_container = $(tab).closest(wrapper_class).find('.resp-tab-content-active .openlayers-container');
        if (map_container.length !== 0) {
          Drupal.behaviors.openlayers_source_googlemaps_refresh.map_refresh(map_container);
        }
      });
    },

    // Define a function for refreshing maps. Dispatch a window resize event
    // to cause Google Maps to refresh, then update Openlayers map size after
    // a brief pause.
    map_refresh: function(context) {
      window.dispatchEvent(new Event('resize'));
      window.setTimeout(function() {
        $('.openlayers-map', context).each(function (index, elem) {
          var map = Drupal.openlayers.getMapById($(elem).attr('id'));
          if (map && map.map !== undefined) {
            map.map.updateSize();
          }
        });
      }, 250);
    }
  };
}(jQuery));
