---
title: Evacuation routing under dynamic congestion in Davis Hall
short: Davis Hall evacuation
date: 2025-09-20
period: Sep – Dec 2025
context: Course project, UC Berkeley
category: infrastructure
tags: [Python, JavaScript, Simulation, Optimization, 3D]
location:
  name: Davis Hall, UC Berkeley
  lat: 37.8746
  lon: -122.2583
summary: Agent-based evacuation on a field-surveyed, 5-floor building network, comparing Dijkstra and A* as corridors jam.
team: With Flora Chang and Xiaoyu Chen.
demo: evacuation
results:
  - label: Network
    value: 5 floors, 532 nodes, 1,166 edges
  - label: A* vs Dijkstra (500 agents)
    value: 36.5% fewer node expansions
  - label: Evacuation time
    value: 166 s vs 171.1 s (3% faster)
  - label: Small one-floor building
    value: No meaningful difference (245 vs 248 expansions)
---

Most evacuation models assume everyone walks at the same speed down the shortest path. Real corridors jam. We measured Davis Hall ourselves and let route costs change as crowds form.

- Surveyed floors 3–7 on site (corridor widths, doors, stairwells) and built a connected 3D evacuation network; also wrote an IFC parser that builds the network directly from BIM models.
- Agents have varied walking speeds, slow down in crowded corridors and replan their routes as they go; corridor weights rise with live occupancy.
- Compared Dijkstra and A* at two scales and visualized the full run in 3D with Three.js.
