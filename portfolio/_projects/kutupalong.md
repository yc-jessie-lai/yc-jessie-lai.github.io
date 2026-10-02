---
title: "Kutupalong: environmental change around a refugee camp"
short: Kutupalong camp
date: 2023-09-15
period: Sep – Dec 2023
context: Remote Sensing course, NCKU
category: earth
tags: [Remote sensing, SAR, GIS]
location:
  name: Kutupalong, Bangladesh
  lat: 21.2120
  lon: 92.1640
summary: Measuring camp expansion, vegetation loss and monsoon flooding from optical and SAR imagery, 2016–2019.
team: With a classmate.
featured: true
results:
  - label: Camp area
    value: 1.35 → 17.90 km² (Nov 2016 → Dec 2018)
  - label: Vegetation
    value: 128.90 → 81.93 km² (Nov 2017 → Dec 2018)
  - label: Largest monsoon flood
    value: 22.73 km² (Jul 2017)
compare:
  before_label: Landsat-8
  after_label: Classified
  default: 1
  legend:
    - { color: "#e8a33a", label: Camp }
    - { color: "#d9c3a0", label: Bare land }
    - { color: "#d6e6ef", label: Water }
    - { color: "#c9e1b2", label: Vegetation }
    - { color: "#7a1f3d", label: Bangladesh–Myanmar border }
  sets:
    - label: Nov 2016
      before: /assets/projects/kutupalong/2016-landsat.jpg
      after: /assets/projects/kutupalong/2016-classified.jpg
      note: "23 Nov 2016 · camp 1.35 km² · bare land 28.33 km² · water 16.61 km² · vegetation 118.90 km²"
    - label: Nov 2017
      before: /assets/projects/kutupalong/2017-landsat.jpg
      after: /assets/projects/kutupalong/2017-classified.jpg
      note: "10 Nov 2017 · camp 10.59 km² · bare land 10.01 km² · water 15.69 km² · vegetation 128.90 km²"
    - label: Dec 2018
      before: /assets/projects/kutupalong/2018-landsat.jpg
      after: /assets/projects/kutupalong/2018-classified.jpg
      note: "31 Dec 2018 · camp 17.90 km² · bare land 54.61 km² · water 10.36 km² · vegetation 81.93 km²"
---

After August 2017 nearly a million Rohingya crossed into Bangladesh, and Kutupalong became the largest refugee camp in the world. We measured what that did to the land around it.

- Classified three dry-season Landsat-8 images in ENVI into camp, bare land, water and vegetation, then measured each class in ArcGIS.
- Processed three monsoon-season Sentinel-1 SAR images in SNAP (terrain correction, dual-pol VV+VH composites) and digitized camp and flood extents.
- The camp grew roughly tenfold within a year of the influx, replacing vegetation with settlement and bare land, while monsoon floods reached into the camp every summer.
