#!/bin/bash 

/usr/bin/wget -O /home/aphfarmos/farmosweb/sites/default/files/curweather/KMGM_$(/bin/date +%Y%m%d%H%M%S).xml http://w1.weather.gov/xml/current_obs/KMGM.xml

