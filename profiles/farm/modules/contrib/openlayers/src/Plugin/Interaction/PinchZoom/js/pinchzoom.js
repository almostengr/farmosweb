Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Interaction:PinchZoom',
  init: function(data) {
    data.opt.constrainResolution = true;
    return new ol.interaction.PinchZoom(data.opt);
  }
});
