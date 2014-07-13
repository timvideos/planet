module Jekyll
  module MarkdownifyGitHubFlavoredMarkdown
    def markdownify_gfm(input)
      require 'kramdown'

      "#{Kramdown::Document.new(input, input: 'GFM').to_html}"
    end
  end
end
 
Liquid::Template.register_filter(Jekyll::MarkdownifyGitHubFlavoredMarkdown)