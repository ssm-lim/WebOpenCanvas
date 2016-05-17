$(function(){
  var layers = $('#layers');
  var heading = layers.find('.panel-heading');
      layers.draggable(heading);
      layers.minimalize(heading);

  var layerList = layer.find('.layer-list');
  layerList.on('click', 'a', function(e){
    layerList.find('a').removeClass('active');

    $(this).addClass('active');
  });

});
