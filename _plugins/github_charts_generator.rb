# Jekyll plugin for fetching data from GitHub to generate more detailed views
#
# Author: Maciej Paruszewski <maciek.paruszewski@gmail.com>
# Site: http://github.com/pinoss
#
# Distributed under the MIT license
# Copyright Maciej Paruszewski 2014

module Jekyll

  class GitHubStatsGenerator < Generator
    priority :low
    safe true

    # Generates data for pages with users key
    #
    # site - the site
    #
    # Returns nothing
    def generate(site)
      site.pages.each do |page|
        if page.data.key? 'projects'
          fetch_project_data(page)
        end
      end
    end

    private

    def fetch_project_data(page)
      require 'octokit'
      require 'json'

      projects = page.data['projects']

      projects_data = {}

      projects.each do |project|
        projects_data[project] = {}

        projects_data[project]['name'] = project

        pie_chart = contributors_pie_chart_data(project)
        projects_data[project]['pie_chart'] = pie_chart unless pie_chart.nil?
        
        code_frequency = code_frequency_chart_data(project)
        projects_data[project]['code_frequency']  = code_frequency unless code_frequency.nil?
        
        commit_activity = commit_activity_stats_chart_data(project)
        projects_data[project]['commit_activity'] = commit_activity unless commit_activity.nil?
        
        commits_per_hour = commits_per_hour_chart_data(project)
        projects_data[project]['commits_per_hour'] = commits_per_hour unless commits_per_hour.nil?
        
        commits_per_weekday = commits_per_weekday_chart_data(project)
        projects_data[project]['commits_per_weekday'] = commits_per_weekday unless commits_per_weekday.nil? 
      end

      page.data['projects_data'] = projects_data
    end

    def contributors_pie_chart_data(project)
      raw_data = get_data(:contributors_stats, project)

      preprocessed_data = raw_data.map do |data|
        [ data[:author][:login], data[:weeks].map { |week| week[:a] + 0.5 * week[:d] + 10 * week[:c] }.inject(:+) ]
      end

      sum = preprocessed_data.map { |author, number| number }.inject(:+)
      
      additional_data = {}
      raw_data.each do |data|
        additional_data[data[:author][:login]] = {
            additions: data[:weeks].map { |week| week[:a] }.inject(:+),
            deletions: data[:weeks].map { |week| week[:d] }.inject(:+),
            commits:   data[:weeks].map { |week| week[:c] }.inject(:+)
          }
      end

      result = preprocessed_data.map do |author, number| 
        {
          name:      author,
          y:         number,
          additions: additional_data[author][:additions],
          deletions: additional_data[author][:deletions],
          commits:   additional_data[author][:commits]
        }
      end

      result.to_json

    rescue => e
      puts "Contributors stats data generation error."
    end

    def code_frequency_chart_data(project)
      raw_data = get_data(:code_frequency_stats, project)

      result = {
        series:
          raw_data.map { |data| data[0] * 1000 },
        data: [
          {
            name: 'additions',
            data: raw_data.map { |data| data[1] }
          },
          {
            name: 'deletions',
            data: raw_data.map { |data| -data[2] }
          }
        ]
      }

      result.to_json

    rescue => e
      puts "Contributors stats data generation error."
    end

    def commit_activity_stats_chart_data(project)
      raw_data = get_data(:commit_activity_stats, project)

      result = {
        series:
          raw_data.map { |data| data[:week] * 1000 },
        data: [
          {
            name: 'commits',
            data: raw_data.map { |data| data[:total] }
          }
        ]
      }

      result.to_json

    rescue => e
      puts "Commit activity data generation error."
    end

    DAY_NAME = {
      0 => 'Sunday',
      1 => 'Monday',
      2 => 'Tuesday',
      3 => 'Wendesday',
      4 => 'Thursday',
      5 => 'Friday',
      6 => 'Saturday'
    }

    def commits_per_weekday_chart_data(project)
      raw_data = get_data(:punch_card_stats, project)

      grouped_by_weekday = raw_data.group_by { |data| data[0] }

      result = grouped_by_weekday.map do |day, data|
        [
          DAY_NAME[day],
          data.map { |d| d[2] }.inject(:+)
        ]
      end

      result.to_json

    rescue => e
      puts "Commits per weekday chart data generation error."
    end

    def commits_per_hour_chart_data(project)
      raw_data = get_data(:punch_card_stats, project)

      grouped_by_hour = raw_data.group_by { |data| data[1] }

      result = grouped_by_hour.map do |hour, data|
        [
          "#{hour}",
          data.map { |d| d[2] }.inject(:+)
        ]
      end

      result.to_json

    rescue => e
      puts "Commits per hour chart data stats data generation error."
    end

    def client
      @client ||= Octokit::Client.new \
        :login    => ENV['OCTOKIT_LOGIN'],
        :password => ENV['OCTOKIT_PASWD']
    end

    def get_data(type, project)
      result = nil

      5.times do
        result = client.send(type, project)
        return result unless result.nil?

        sleep 1 
      end

      result
    end
  end
end