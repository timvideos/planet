module Jekyll
  module DarkerColorFilter
    def darken_color(input, amount)
      hex_color = input.gsub('#', '').downcase

      if hex_color.length == 3
        hex_color = "#{hex_color[0] * 2}#{hex_color[1] * 2}#{hex_color[2] * 2}"
      end

      rgb    = hex_color.scan(/../).map { |color| color.hex }
      rgb[0] = (rgb[0].to_i * amount).round
      rgb[1] = (rgb[1].to_i * amount).round
      rgb[2] = (rgb[2].to_i * amount).round
      
      "#%02x%02x%02x" % rgb
    end
  end
end
 
Liquid::Template.register_filter(Jekyll::DarkerColorFilter)