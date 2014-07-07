$(document).ready(function(){
  issuesLoader.init();
  issuesAutoComplete.init();
  issuesFilter.init();
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
      var $showMore = $(this),
          $issue = $showMore.closest('.issue'),
          $hideMore = $issue.find('.hide-more'),
          $content = $issue.find('.issue-content');
          
      $content.show();

      $showMore.hide();
      $hideMore.show();

    });
  },

  initHideMoreClick: function(){
    $('#main .issues').on('click', '.hide-more', function(){
      var $hideMore = $(this),
          $issue = $hideMore.closest('.issue'),
          $showMore = $issue.find('.show-more'),
          $content = $issue.find('.issue-content');
      
      $content.hide();

      $hideMore.hide();
      $showMore.show();
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

var issuesFilter = {
  init: function(){
    this.searchInit();
    this.resetInit();
  },

  searchInit: function(){
    $('#main').on('click', '.issues-filter .issues-search', function(e){
      e.preventDefault();

      var $issues        = $('.issues'),
          $issuesFilter  = $('.issues-filter'),
          filterTitle    = $.trim($issuesFilter.find('#inputTitle').val().toLowerCase()),
          filterBody     = $.trim($issuesFilter.find('#inputBody').val().toLowerCase()),
          filterAuthor   = $.trim($issuesFilter.find('#inputAuthor').val().toLowerCase()),
          filterAssignee = $.trim($issuesFilter.find('#inputAssignee').val().toLowerCase());

      for(var i=0; i < $issues.length; ++i){
        var $issue      = $($issues[i]),
            $issueData  = $issue.find('.issue'),
            title       = $issue.find('.issue-title').text().toLowerCase(),
            body        = $issue.find('.issue-body').text().toLowerCase(),
            author      = $issueData.data('author').toLowerCase(),
            assignee    = $issueData.data('assignee').toLowerCase();

        var showIssue = true;

        if(filterTitle.length){
          if(title.indexOf(filterTitle) < 0) {
            showIssue = false;
          }
        }

        if(filterBody.length){
          if(body.indexOf(filterBody) < 0) {
            showIssue = false;
          }
        }

        if(filterAuthor.length){
          if(author.indexOf(filterAuthor) < 0) {
            showIssue = false;
          }
        }

        if(filterAssignee.length){
          if(assignee.indexOf(filterAssignee) < 0) {
            showIssue = false;
          }
        }

        if(showIssue)
          $issue.show();
        else
          $issue.hide();

      }
    });
  },
  resetInit: function(){
    $('#main').on('click', '.issues-filter .issues-reset', function(e){
      e.preventDefault();

      var $resetButton = $(this),
          $form        = $resetButton.closest('form');
          $issues      = $('.issues');

      $form.get(0).reset();
      $issues.show();
    });
  }
}