#!/usr/bin/env python

import cgi
import sys, os, string
import operator
from osgeo import gdal, osr, ogr

print "Content-Type: text/html"
print

qs = os.environ["QUERY_STRING"]
d = cgi.parse_qs(qs)
layer = d["layer"][0]
bbox = d["bbox"][0]
bbox = string.replace(bbox, ',', ' ')

# fill in datadir with your server settings
datadir = ''
filename = operator.concat(layer, '.shp')

outbbox = string.replace(bbox, ' ', '_')
newfile = operator.concat(layer, outbbox)
newfile = operator.concat(newfile, '.shp')
newzip = string.replace(newfile, '.shp', '.zip')

infile = operator.concat(datadir, filename)
outfile = operator.concat(datadir, newfile)

command = operator.concat("/usr/local/bin/ogr2ogr -spat ", bbox)
command = operator.concat(command, " ")
command = operator.concat(command, outfile)
command = operator.concat(command, " ")
command = operator.concat(command, infile)

os.system(command)
os.chdir(datadir)

zipcommand = operator.concat("/usr/bin/zip -rD ", newzip)
zipcommand = operator.concat(zipcommand, " ")
zipcommand = operator.concat(zipcommand, string.replace(newzip, '.zip', ''))
zipcommand = operator.concat(zipcommand, ".*")

os.system(zipcommand)

downloadlink = "http://haitimapguide.org/map/data/"
downloadlink = operator.concat(downloadlink, newfile)
downloadlink = string.replace(downloadlink, '.shp', '.zip')

output = "<div id='downloadlink'><p>Your download is ready:</p><p><a href='"
output = operator.concat(output, downloadlink)
output = operator.concat(output, "'>")
output = operator.concat(output, downloadlink)
output = operator.concat(output, "</a></p><p><a href='http://haitimapguide.org/map/'></p></div>")
print output
