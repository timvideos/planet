# Jekyll plugin for fetching data from GitHub to generate more detailed views
#
# Author: Maciej Paruszewski <maciek.paruszewski@gmail.com>
# Site: http://github.com/pinoss
#
# Distributed under the MIT license
# Copyright Maciej Paruszewski 2014

module Jekyll

  class GitHubUsersGenerator < Generator
    priority :low
    safe true

    # Generates data for pages with users key
    #
    # site - the site
    #
    # Returns nothing
    def generate(site)
      site.pages.each do |page|
        if page.data.key? 'users'
          fetch_user_data(page)
        end
      end
    end

    private

    def fetch_user_data(page)
      require 'octokit'

      client = Octokit::Client.new \
        :login    => ENV['OCTOKIT_LOGIN'],
        :password => ENV['OCTOKIT_PASWD']

      users = page.data['users'].keys

      users_data = {}

      users.each do |user|
        users_data[user] = {}

        if page.data['users'][user]['github']
          user_data = client.user(user)

          users_data[user] = {
            'github_login' => user_data['login'],
            'avatar_url' => user_data['avatar_url'],
            'profile_url' => user_data['html_url'],
            'name' => user_data['name'],
            'blog' => user_data['blog'],
            'location' => user_data['location'],
            'public_repos' => user_data['public_repos'],
            'followers' => user_data['followers']
          }
        end

        users_data[user]['nickname'] = user

        if page.data['users'][user]['name']
          users_data[user]['name'] = page.data['users'][user]['name']
        end

        if page.data['users'][user]['projects']
          users_data[user]['projects'] = page.data['users'][user]['projects']
        end

        if page.data['users'][user]['description']
          users_data[user]['description'] = page.data['users'][user]['description']
        end

        if page.data['users'][user]['avatar_url']
          users_data[user]['avatar_url'] = page.data['users'][user]['avatar_url']
        end

        if page.data['users'][user]['profile_url']
          users_data[user]['profile_url'] = page.data['users'][user]['profile_url']
        end

        if page.data['users'][user]['blog']
          users_data[user]['blog'] = page.data['users'][user]['blog']
        end

        if page.data['users'][user]['location']
          users_data[user]['location'] = page.data['users'][user]['location']
        end

      end

      page.data['users_data'] = users_data
    end
  end
end