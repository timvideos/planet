$(document).ready(function(){
  ajaxPostLoader.init();
  tooltipInitializer.init();
  fancyBoxInitializer.init();
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
    $('#main .news').on('click', '.show-more', function(){
      var $showMore = $(this),
          $post     = $showMore.closest('.post'),
          $hideMore = $post.find('.hide-more'),
          $excerpt  = $post.find('.post-excerpt'),
          $content  = $post.find('.post-content'),
          jsonPath  = $post.data('json');

      $showMore.addClass('disabled');
      $showMore.text('Loading...');

      if($content.text().length > 0){
        $excerpt.hide();
        $content.show();

        ajaxPostLoader.showHideMoreButton($showMore, $hideMore);
      }
      else{
        $.getJSON(jsonPath, function(data){
          $excerpt.hide();
          $content.html(data.content);

          ajaxPostLoader.showHideMoreButton($showMore, $hideMore);
        });
      }

    });
  },

  initHideMoreClick: function(){
    $('#main .news').on('click', '.hide-more', function(){
      var $hideMore = $(this),
          $post     = $hideMore.closest('.post'),
          $showMore = $post.find('.show-more'),
          $excerpt  = $post.find('.post-excerpt'),
          $content  = $post.find('.post-content');
      
      $hideMore.addClass('disabled');
      $hideMore.text('Loading...');

      $excerpt.show();
      $content.hide();

      ajaxPostLoader.showShowMoreButton($showMore, $hideMore);
    });
  },

  showHideMoreButton: function($showMore, $hideMore){
    $showMore.removeClass('disabled');
    $showMore.hide();
    $hideMore.show();

    $hideMore.removeClass('disabled');
    $hideMore.text('Hide more...');
  },

  showShowMoreButton: function($showMore, $hideMore){
    $hideMore.removeClass('disabled');
    $hideMore.hide();
    $showMore.show();
    
    $showMore.removeClass('disabled');
    $showMore.text('Show more...');
  }

}

var tooltipInitializer = {

  init: function() {
    $('[data-toggle="tooltip"]').tooltip();
  }

}
