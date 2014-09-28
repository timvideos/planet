# Jekyll plugin for generating iframe pages (with specific layout)
#
# Author: Maciej Paruszewski <maciek.paruszewski@gmail.com>
# Site: http://github.com/pinoss
#
# Distributed under the MIT license
# Copyright Maciej Paruszewski 2014

module Jekyll
  module IFrameable

    def data
      current_layout = super['layout']
      super.merge('layout' => "#{current_layout}-iframe", 'type' => 'iframe', 'subdir' => '/iframe')
    end

    def template
      "/iframe/#{super}"
    end

    # def render(layouts, site_payload)
    #   super(layouts, site_payload)
    # end

  end

  class IFrameGenerator < Generator
    priority :low
    safe true

    # Generates iframe pages
    #
    # site - the site
    #
    # Returns nothing
    def generate(site)
      generate_pages(site)
      generate_posts(site)
    end

    private

    def generate_posts(site)
      site.posts.each do |post|
        post.data['type'] = 'standard'
      end

      standard_posts = site.posts.clone

      standard_posts.each do |post|
        iframed_post = post.clone.extend(IFrameable)
        site.posts << iframed_post
      end
    end

    def generate_pages(site)
      site.pages.each do |page|
        page.data['type'] = 'standard'
      end

      standard_pages = site.pages.clone

      standard_pages.each do |page|
        iframed_page = page.clone.extend(IFrameable)
        site.pages << iframed_page
      end
    end
  end
end