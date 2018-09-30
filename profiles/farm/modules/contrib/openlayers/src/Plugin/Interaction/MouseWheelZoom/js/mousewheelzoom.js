Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Interaction:MouseWheelZoom',
  init: function(data) {
    data.opt.constrainResolution = true;
    return new ol.interaction.MouseWheelZoom(data.opt);
  }
});
