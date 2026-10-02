---
title: Scheduling solar and batteries for a campus microgrid
short: Campus microgrid
date: 2026-01-15
period: Jan – May 2026
context: Course project, UC Berkeley
category: infrastructure
tags: [Python, Optimization]
location:
  name: UC Berkeley campus
  lat: 37.8716
  lon: -122.2605
summary: A 24-hour linear program over 133 campus buildings, testing what solar, batteries and power sharing are each worth.
team: With Philippine Blijdenstein, Flora Chang and Xiaoyu Chen.
featured: true
demo: microgrid
results:
  - label: Weekly operating cost
    value: −14.20% ($55,056 saved)
  - label: CO₂ emissions
    value: −13.84% (117 t per week)
  - label: Battery fleet
    value: ≈ 88 MWh / 14.6 MW
  - label: Key finding
    value: Local storage captures almost all the value; sharing between buildings adds 0.4 points
---

If every building on campus had rooftop solar and a battery, how much would it save, and does it help to let buildings share power? We built a single linear program over 24 hours and 133 buildings to find out.

- Used real hourly load from the UC Berkeley Energy Use Dashboard, and estimated rooftop solar for 124 buildings from the six with metered PV.
- Auto-sized a battery for every building and allowed power transfers between buildings within 300 m, solved in Python with PuLP/CBC.
- Compared four designs, each adding one feature to the last, then ran sensitivity tests on solar capacity, electricity tariffs and solar forecast noise.
