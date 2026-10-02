---
title: Peak and off-peak campus traffic from bicycle GPS tracks
short: Campus bike traffic
date: 2024-02-20
period: Feb – Jun 2024
context: Course project, NCKU
category: mobility
tags: [GIS, R, Mobility data, Simulation]
location:
  name: NCKU Chengkung campus, Tainan
  lat: 22.9968
  lon: 120.2195
summary: Riding two campus routes with GPS at four times of day to find peak hours and conflict hotspots.
team: With three classmates.
demo: bike
results:
  - label: GPS tracks
    value: 31 rides on 2 routes
  - label: Peak periods
    value: 12:00 and 17:00
  - label: Off-peak
    value: 9:30 and 14:30
  - label: Conflict hotspots
    value: Route crossing, two department buildings, campus gates at peak
---

At NCKU almost everyone bikes between classes, and lunchtime gets chaotic. We rode the two main routes across the Chengkung campus at 9:30, 12:00, 14:30 and 17:00 with GPS running, then looked at where and when riders get slowed down.

- Cleaned the tracks in ArcGIS Pro, then used moveHMM step lengths and turning angles in R to separate peak from off-peak riding.
- Used DBSCAN to find where track points bunch up, a sign that riders are slowing down.
- Built a NetLogo agent-based model of bikes and pedestrians; conflicts concentrated near the corners of intersections.
- Recommended proper bike parking near the busiest buildings and campus-wide traffic awareness.
