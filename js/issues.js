$(document).ready(function(){
  issuesLoader.init();
  issuesAutoComplete.init();
  issuesFilter.init();
  issuesDiagramFiter.init();
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
    this.radioCheckboxInit();
    this.advancedSearchInit();
    this.labelsSelectInit();
  },

  searchInit: function(){
    $('#main').on('click', '.issues-filter .issues-search', function(e){
      e.preventDefault();

      var $issues          = $('.issues'),
          $issuesFilter    = $('.issues-filter'),
          filterTitle      = $.trim($issuesFilter.find('#inputTitle').val().toLowerCase()),
          filterBody       = $.trim($issuesFilter.find('#inputBody').val().toLowerCase()),
          filterAuthor     = $.trim($issuesFilter.find('#inputAuthor').val().toLowerCase()),
          filterAssignee   = $.trim($issuesFilter.find('#inputAssignee').val().toLowerCase()),
          $assigneedYes    = $issuesFilter.find('#inputAssigneedYes'),
          $assigneedNo     = $issuesFilter.find('#inputAssigneedNo'),
          $stateOpen       = $issuesFilter.find('#inputStateOpen'),
          $stateClosed     = $issuesFilter.find('#inputStateClosed'),
          $filterLabels    = $issuesFilter.find('.labels .label-selected'),
          $filterMilestone = $issuesFilter.find('.issue-milestone:checked'),
          $specialFiltersCheckboxes = $('.issue-special-filter input[type="checkbox"]:checked');

      for(var i=0; i < $issues.length; ++i){
        var $issue          = $($issues[i]),
            $issueData      = $issue.find('.issue'),
            $labels         = $issue.find('.labels .label'),
            title           = $issue.find('.issue-title').text().toLowerCase(),
            body            = $issue.find('.issue-body').text().toLowerCase(),
            milestoneId     = $issueData.data('milestone-id'),
            author          = $issueData.data('author').toLowerCase(),
            state           = $issueData.data('state').toLowerCase(),
            assignee        = $issueData.data('assignee').toLowerCase();
             

        var showIssue = true;

        if(showIssue && filterTitle.length){
          if(title.indexOf(filterTitle) < 0) {
            showIssue = false;
          }
        }

        if(showIssue && filterBody.length){
          if(body.indexOf(filterBody) < 0) {
            showIssue = false;
          }
        }

        if(showIssue && filterAuthor.length){
          if(author.indexOf(filterAuthor) < 0) {
            showIssue = false;
          }
        }

        if(showIssue && filterAssignee.length){
          if(assignee.indexOf(filterAssignee) < 0) {
            showIssue = false;
          }
        }

        if(showIssue && $assigneedYes.is(':checked')){
          if(!assignee) {
            showIssue = false;
          }
        }

        if(showIssue && $assigneedNo.is(':checked')){
          if(assignee && assignee.length > 0) {
            showIssue = false;
          }
        }

        if(showIssue && $stateOpen.is(':checked')){
          if(state != 'open') {
            showIssue = false;
          }
        }

        if(showIssue && $stateClosed.is(':checked')){
          if(state != 'closed') {
            showIssue = false;
          }
        }

        if(showIssue && $filterMilestone.length){
          if(milestoneId != $filterMilestone.data('milestone-id')){
            showIssue = false;
          }
        }

        if(showIssue && $specialFiltersCheckboxes.length){
          for(var j=0; j < $specialFiltersCheckboxes.length; ++j){
            var $checkbox = $($specialFiltersCheckboxes[j]),
                specialFilterType  = $checkbox.data('special-filter-type'),
                specialFilterValue = $checkbox.data('special-filter-value');

            if(!showIssue)
              break;

            if($issueData.data(specialFilterType)){
              var issueSpecialFilterValues = $issueData.data(specialFilterType).split(';'),
                  anyEquals = false;

              for(var k=0; k < issueSpecialFilterValues.length; ++k){
                if(issueSpecialFilterValues[k] == specialFilterValue) {
                  anyEquals = true;
                  break;
                }
              }

              if(!anyEquals)
                showIssue = false;
            }
            else{
              showIssue = false;
            }
          }
        }

        if(showIssue && $filterLabels.length){
          for(var j=0; j < $filterLabels.length; ++j){
            var $label     = $($filterLabels[j]),
                labelValue = $.trim($label.text()),
                anyEquals = false;

            if(!showIssue)
              break;

            for(var k=0; k < $labels.length; ++k){
              if($.trim($($labels[k]).text()) == labelValue) {
                anyEquals = true;
                break;
              }
            }

            if(!anyEquals)
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
          $issues      = $('.issues'),
          $selectedLabels = $('.label-selected');

      $form.get(0).reset();
      $issues.show();
      $selectedLabels.removeClass('label-selected');
    });
  },

  advancedSearchInit: function(){
    $('#main').on('click', '.issues-filter .issues-advanced', function(e){
      e.preventDefault();

      var $advancedSearchFilter = $('.issues-advanced-search');
      
      $advancedSearchFilter.toggle();
    });
  },

  radioCheckboxInit: function(){
    $('#main').on('change', '.issues-filter .radio-checkbox', function(e){
      var $self          = $(this),
          $formGroup     = $self.closest('.form-group'),
          $allCheckboxes = $formGroup.find('.radio-checkbox'); 

      $allCheckboxes.not($self).attr('checked', false);
    });
  },

  labelsSelectInit: function(){
    $('#main').on('click', '.issues-filter .label-selector', function(e){
      var $self = $(this);

      $(this).toggleClass('label-selected');
    });
  }
}

var issuesDiagramFiter = {
  init: function(){
    this.initShowDiagramButton();
    this.initMap();
  },

  initShowDiagramButton: function(){
    $('#main').on('click', '.issues-filter .issues-diagram', function(e){
      e.preventDefault();

      var $diagramFilter = $('.issues-diagram-search');
      
      $diagramFilter.toggle();
    });
  },

  initMap: function(){
    var $filter = $('.issues-filter'),
        $resetButton = $filter.find('.issues-reset'),
        $searchButton = $filter.find('.issues-search');

    $('#main').on('click', 'map [href="#hdmi2usb-extension-boards-projects"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="HDMI2USB (Extension Boards)"][data-special-filter-type="project"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#hdmi2usb-firmware-projects"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="HDMI2USB"][data-special-filter-type="project"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#gst-switch"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="gst-switch"][data-special-filter-type="project"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#gstreamer"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="gstreamer"][data-special-filter-type="project"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#streaming-system"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Streaming System (Website)"][data-special-filter-type="project"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#flumotion"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Flumotion"][data-special-filter-type="project"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#software"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Software"][data-special-filter-type="type"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#hardware"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Hardware"][data-special-filter-type="type"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#firmware"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Firmware"][data-special-filter-type="type"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#c"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="C"][data-special-filter-type="language"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#python"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Python"][data-special-filter-type="language"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });

    $('#main').on('click', 'map [href="#web"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      $resetButton.trigger('click');
      $filter.find('[data-special-filter-value="Javascript/HTML"][data-special-filter-type="language"]').prop('checked', true);
      $searchButton.trigger('click');
      $('#main').scrollTo('#issues-start');
    });
  }
}