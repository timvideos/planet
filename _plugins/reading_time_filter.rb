# Outputs the reading time
 
# Read this in “about 4 minutes”
# Put into your _plugins dir in your Jekyll site
# Usage: Read this in about {{ page.content | reading_time }}

module Jekyll
  module ReadingTimeFilter
    def reading_time(input)
      words_per_second = 3

      words = input.split.size;
      seconds = ( words / words_per_second ).floor
      minutes_label = seconds <= 120 ? " minute" : " minutes"
      if seconds >= 60
        "about #{seconds/60} #{minutes_label}"
      elsif seconds <= 1
        "about 1 second"
      else
        "about #{(seconds/5.0).ceil * 5} seconds"
      end
    end
  end
end
 
Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)