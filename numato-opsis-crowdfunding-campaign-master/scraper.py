#!/usr/bin/python

import time
import bs4
import urllib2
from pprint import pprint

def download_page(url):
    retry = 0
    while retry < 5:
        try:
            print "Downloading", url
            return bs4.BeautifulSoup(urllib2.urlopen(url).read().decode('utf-8'), "lxml")
            break
        except urllib2.HTTPError, e:
            print "Failed to get", repr(url), "retrying"
            retry += 1
        except:
            print "Failed to get", repr(url)
            raise
    else:
        raise IOError("Failed to get %r", url)

url = "https://www.crowdsupply.com/numato-lab/opsis"
page = download_page(url)
project = page.find('section', attrs={'class':'section-project'})

facts = [" ".join(fact.text.split()).strip() for fact in project.findAll(attrs={'class': 'fact'})]

left, percent_funded, pledges = facts

pledged = project.find(attrs={'class': 'project-pledged'}).text.strip()
goal = project.find(attrs={'class': 'project-goal'}).text.strip()


ends = page.find(attrs={'class': 'project-remind-me'}).find('p').text.split(' on ')[-1]

data={
  'url': url, 
  'time': time.time(), 
  'pledged': int(pledged.split()[0][1:].replace(',', '')),
  'goal': int(goal.split()[1][1:].replace(',', '')), 
  'percent_funded': int(percent_funded.split()[0][:-1]),
  'pledges': int(pledges.split()[0]),
  'left': left,
  'ends': ends,
}
import json
json.dump(data, file('data.json','w'))

project_box = page.find('div', attrs={'class': 'project-block'})

print "%(pledges)i pledges - $%(pledged)i of $%(goal)i (%(percent_funded)s%%) - Ends %(ends)s (%(left)s)" % data

page = """\
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<div class='container'>
<div class='crowdsupply-box'>

<div class='image'>
 <a href="https://www.crowdsupply.com/numato-lab/opsis" target="_top">
   <img src="https://www.crowdsupply.com/img/35c2/hdmi2usb-1-1_jpg_project-tile.jpg">
 </a>
</div>
<div class="message">
 The <a href="http://hdmi2usb.tv/numato-opsis" target="_top">Numato Opsis</a>, the first open hardware for the <a href="http://hdmi2usb.tv" target="_top">HDMI2USB.tv</a> firmware,<br>
 <a href="https://www.crowdsupply.com/numato-lab/opsis" target="_top">
 Can now be ordered on 
   <img src="https://www.crowdsupply.com/_teal/images/crowd-supply-logo-light@2x.png" style="padding: 2px; height: 2em; vertical-align: middle;">
 </a>
</div>

%(project_box)s

<div class='end'></div>
</div>
</div>
</body>
""".encode('utf-8') % locals()

page = page.replace('<p class="project-pledged">','<div class="project-funds"><p class="project-pledged">')
page = page.replace('<div class="factoids">', '</div><div class="factoids">')
page = page.replace("text=Check+out+this+Crowd+Supply+project", "text=Support+on+Crowd+Supply+the+@numatolab+Opsis+board,+a+new+open+video+platform!")
file('badge.html', 'w').write(page)

try:
  import scraperwiki
  scraperwiki.sqlite.save(unique_keys=['url', 'time'], data=data)
except ImportError:
  pass
