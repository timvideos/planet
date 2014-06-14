module Jekyll
  class TagUrlTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text.strip unless text.nil?
    end

    def render(context)
      site = context.registers[:site]

      tag_dir = site.config['tag_dir'] || 'tags'

      "/#{tag_dir}/#{@text}"
    end
  end
end

Liquid::Template.register_tag('tag_url', Jekyll::TagUrlTag)
