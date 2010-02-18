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

infile = operator.concat(datadir, filename)
outfile = operator.concat(datadir, newfile)

command = operator.concat("/usr/local/bin/ogr2ogr -spat ", bbox)
command = operator.concat(command, " ")
command = operator.concat(command, outfile)
command = operator.concat(command, " ")
command = operator.concat(command, infile)

os.system(command)

downloadlink = "http://haitimapguide.org/map/data/"
downloadlink = operator.concat(downloadlink, newfile)

output = "<h2>Haiti Map Data</h2><p>Your download is ready:</p><p><a href='"
output = operator.concat(output, downloadlink)
output = operator.concat(output, "'>")
output = operator.concat(output, downloadlink)
output = operator.concat(output, "</a></p><p><a href='http://haitimapguide.org/map/'>Return to map</a></p>")
print output