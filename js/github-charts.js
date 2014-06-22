$(document).ready(function(){
  contributorsPieChartInitializer.init();
});

var contributorsPieChartInitializer = {

  init: function(){
    for(var project in ProjectsChartsData){
      var projectData = ProjectsChartsData[project];

      contributorsPieChartInitializer.initializePieChartForProject(project, projectData.charts.pieChart);
    }
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
  }
}
