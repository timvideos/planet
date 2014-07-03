# Jekyll plugin for fetching data from GitHub to generate more detailed views
#
# Author: Maciej Paruszewski <maciek.paruszewski@gmail.com>
# Site: http://github.com/pinoss
#
# Distributed under the MIT license
# Copyright Maciej Paruszewski 2014

module Jekyll

  class GitHubIssuesGenerator < Generator
    priority :low
    safe true

    # Generates data for pages with users key
    #
    # site - the site
    #
    # Returns nothing
    def generate(site)
      site.pages.each do |page|
        if page.data.key? 'issues'
          fetch_project_data(page)
        end
      end
    end

    private

    def fetch_project_data(page)
      require 'octokit'
      require 'json'

      projects = page.data['issues']

      projects_data = {}

      projects.each do |project|
        issues = github_issues(project)
        next if issues.empty?

        projects_data[project] = {}
        projects_data[project]['name'] = project
        projects_data[project]['issues'] = issues 
      end

      page.data['issues_data'] = projects_data
    end

    def github_issues(project)
      result = []

      page = 1
      data = []
      begin
        data = get_data(:issues, project, page: page)
        page += 1

        result += data
      end while !data.nil? and !data.empty?

      result.map { |issue| parse_issue(issue) }
    end

    def parse_issue(issue)
      result = {}

      result['user_avatar'] = issue[:user][:avatar_url]
      result['user_login']  = issue[:user][:login]
      result['user_url']    = issue[:user][:url]

      result['labels'] = issue[:labels].map do |label|
        {
          'name'  => label[:name],
          'color' => label[:color]
        }
      end

      result['number']    = issue[:number]
      result['title']     = issue[:title]
      result['state']     = issue[:state]
      result['date']      = issue[:created_at]
      result['closed_at'] = issue[:closed_at]
      result['url']       = issue[:html_url]
      result['assignee']  = issue[:assignee]
      result['body']      = issue[:body]

      result
    end

    def client
      @client ||= Octokit::Client.new \
        :login    => ENV['OCTOKIT_LOGIN'],
        :password => ENV['OCTOKIT_PASWD']
    end

    def get_data(type, project, opts = {})
      result = nil

      5.times do
        result = client.send(type, project, opts)
        return result unless result.nil?

        sleep 1 
      end

      result
    end

  end
end