$(document).ready(function(){
  fancyBoxInitializer.init();
  ajaxPostLoader.init();
});


var fancyBoxInitializer = {

  init: function(){
    $('a').each(function () {
      if ($(this).has('img')) {
        $(this).fancybox();
      }
    });
  }
}

var ajaxPostLoader = {

  init: function(){
    this.initShowMoreClick();
    this.initHideMoreClick();
  },

  initShowMoreClick: function(){
    $('#main').on('click', '.show-more', function(){
      var $self = $(this),
          $post = $self.closest('.post'),
          $excerpt = $post.find('.post-excerpt'),
          $content = $post.find('.post-content'),
          json_path = $post.data('json');

      $self.addClass('disabled');
      $self.text('Loading...');

      if($content.text().length > 0){
        $excerpt.hide();
        $content.show();

        ajaxPostLoader.showHideMoreButton($self);
      }
      else{
        $.getJSON(json_path, function(data){
          $excerpt.hide();
          $content.html(data.content);

          ajaxPostLoader.showHideMoreButton($self);
        });
      }

    });
  },

  initHideMoreClick: function(){
    $('#main').on('click', '.hide-more', function(){
      var $self = $(this),
          $post = $self.closest('.post'),
          $excerpt = $post.find('.post-excerpt'),
          $content = $post.find('.post-content');
      
      $self.addClass('disabled');
      $self.text('Loading...');

      $excerpt.show();
      $content.hide();

      ajaxPostLoader.showShorMoreButton($self);
    });
  },

  showHideMoreButton: function($self){
    $self.removeClass('disabled');

    $self.addClass('hide-more');
    $self.removeClass('show-more');

    $self.text('Hide post...');
  },

  showShorMoreButton: function($self){
    $self.removeClass('disabled');

    $self.addClass('show-more');
    $self.removeClass('hide-more');

    $self.text('Read more...');
  }

}