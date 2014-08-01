$(document).ready(function(){
  contributorsPieChartInitializer.init();
});

var contributorsPieChartInitializer = {

  init: function(){
    for(var project in ProjectsChartsData){
      var projectData = ProjectsChartsData[project];

      contributorsPieChartInitializer.initializePieChartForProject(project, projectData.charts.pieChart);
      contributorsPieChartInitializer.initializeCommitsPerWeekdayChartForProject(project, projectData.charts.commitsPerWeekday);
      contributorsPieChartInitializer.initializeCommitsPerHourChartForProject(project, projectData.charts.commitsPerHour);
      contributorsPieChartInitializer.initializeCodeFrequencyForProject(project, projectData.charts.codeFrequency);
      contributorsPieChartInitializer.initializeCommitActivityForProject(project, projectData.charts.commitActivity);
    }

    setTimeout(function(){ $('#main').removeClass('loading') }, 2000)
  },

  initializePieChartForProject: function(project, projectData){
    $(function(){
      $('[data-project="'+ project +'"] .pie-chart').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Contributors activity'
        },
        tooltip: {
          pointFormat: 'additions: <b>{point.additions}</b><br/>deletions: <b>{point.deletions}</b><br/>commits: <b>{point.commits}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Contributors',
          data: projectData
        }]
      });
    });
  },

  initializeCommitsPerWeekdayChartForProject: function(project, projectData){
    $(function(){
      $('[data-project="'+ project +'"] .commits-per-weekday').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Commits per weekday'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Commits per weekday',
          data: projectData
        }]
      });
    });
  },

  initializeCommitsPerHourChartForProject: function(project, projectData){
    $(function(){
      $('[data-project="'+ project +'"] .commits-per-hour').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Commits per hour'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Commits per hour',
          data: projectData
        }]
      });
    });
  },

  initializeCodeFrequencyForProject: function(project, projectData){
    $(function(){
      $('[data-project="'+ project +'"] .code-frequency').highcharts({
        chart: {
          type: 'area',
          zoomType: 'x'
        },
        title: {
          text: 'Code frequency statistics'
        },
        xAxis: {
          type: 'datetime',
          categories: projectData.series,
          labels: {
            formatter: function() {
                return Highcharts.dateFormat('%b %Y', this.value);
            }
          },
          tickInterval: 30 * 24 * 3600 * 1000,
          // tickmarkPlacement: 'on',
          title: {
            enabled: false
          }
        },
        yAxis: {
          title: {
            text: 'Lines of code'
          },

        },
        tooltip: {
          shared: true
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
              enabled: false,
            }
          }
        },
        series: projectData.data
      });
    });
  },


  initializeCommitActivityForProject: function(project, projectData){
    $(function(){
      $('[data-project="'+ project +'"] .commit-activity').highcharts({
        chart: {
          zoomType: 'x'
        },
        title: {
          text: 'Commits activity statistics'
        },
        xAxis: {
          type: 'datetime',
          categories: projectData.series,
          labels: {
            formatter: function() {
                return Highcharts.dateFormat('%b %Y', this.value);
            }
          },
          tickInterval: 30 * 24 * 3600 * 1000,
          // tickmarkPlacement: 'on',
          title: {
            enabled: false
          }
        },
        yAxis: {
          title: {
            text: 'Commits'
          },

        },
        tooltip: {
          shared: true
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
              enabled: false,
            }
          }
        },
        series: projectData.data
      });
    });
  }
}
