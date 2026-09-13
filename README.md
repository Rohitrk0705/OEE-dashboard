# OEE Dashboard

A real-time OEE (Overall Equipment Effectiveness) monitoring dashboard for shop-floor production lines, built with React, Vite, and Chart.js. It mirrors the Delta DVP-EH3-L PLC's register map (`D100`–`D237` for shift/production/ratio data, `M100`–`M109` for machine status bits), so every metric on screen traces back to a named register in the ladder logic.

**Live demo:** https://rohitrk0705.github.io/OEE-dashboard/

## Features

- Multi-machine monitoring across 3 production stations
- The 4 OEE pillars — Availability, Performance, Quality, and overall OEE — computed live per shift
- Pareto-style loss breakdown across planned and unplanned downtime categories
- Weekly performance trend chart with per-metric views
- PLC register inspector mapping live values to their Delta EH3-L register addresses
- Manual HMI entry modal for overriding shift counts and loss minutes
- CSV export of shift and historical data
- Dark / light theme toggle

## Local Development

```bash
npm install
npm run dev
```

To build a production bundle:

```bash
npm run build
```

## Deployment

Pages deployment is automatic: every push to `main` triggers the GitHub Actions workflow, which builds the app and publishes it to GitHub Pages.
