module Jekyll
  class CategoryUrlTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text.strip unless text.nil?
    end

    def render(context)
      site = context.registers[:site]

      category_dir = site.config['category_dir'] || 'categories'

      "/#{category_dir}/#{@text}"
    end
  end
end

Liquid::Template.register_tag('category_url', Jekyll::CategoryUrlTag)
