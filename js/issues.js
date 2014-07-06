$(document).ready(function(){
  issuesLoader.init();
  issuesAutoComplete.init();
});

var planetHelperMethods = {

  substringMatcher: function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
       
      matches = [];
      substrRegex = new RegExp(q, 'i');
       
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push({ value: str });
        }
      });
       
      cb(matches);
    };
  }
}

var issuesLoader = {

  init: function(){
    this.initShowMoreClick();
    this.initHideMoreClick();
  },

  initShowMoreClick: function(){
    $('#main .issues').on('click', '.show-more', function(){
      var $show_more = $(this),
          $issue = $show_more.closest('.issue'),
          $hide_more = $issue.find('.hide-more'),
          $content = $issue.find('.issue-content');
          
      $content.show();

      $show_more.hide();
      $hide_more.show();

    });
  },

  initHideMoreClick: function(){
    $('#main .issues').on('click', '.hide-more', function(){
      var $hide_more = $(this),
          $issue = $hide_more.closest('.issue'),
          $show_more = $issue.find('.show-more'),
          $content = $issue.find('.issue-content');
      
      $content.hide();

      $hide_more.hide();
      $show_more.show();
    });
  }
}
var issuesAutoComplete = {

  init: function(){
    this.initAuthors();
    this.initTitles();
    this.initAssignees();
  },

  initAuthors: function() {
    $('.issues-author .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'author',
      displayKey: 'value',
      source: planetHelperMethods.substringMatcher(ProjectsIssuesData.authors)
    });
  },

  initTitles: function() {
    $('.issues-title .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'title',
      displayKey: 'value',
      source: planetHelperMethods.substringMatcher(ProjectsIssuesData.titles)
    });
  },

  initAssignees: function() {
    $('.issues-assignee .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'assignee',
      displayKey: 'value',
      source: planetHelperMethods.substringMatcher(ProjectsIssuesData.assignees)
    });
  }
}