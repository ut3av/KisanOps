# KisanOps 5-Minute Deterministic Demo Script

This document details the exact 12-scene walkthrough designed for live evaluator demonstrations and hackathon judging.

---

## 🧭 Pre-Flight Setup
1. Launch KisanOps locally: `npm run dev`
2. Open `http://localhost:5173` in a desktop or mobile browser.
3. Observe the top **5-Min Interactive Demo Bar**.

---

## 🎬 Step-by-Step 12-Scene Script

### Scene 1: Demand Intelligence Shortage Detection
- **Action**: Click `Scene 1` or navigate to `/chc/demand`.
- **Narration**: *"KisanOps analyzes Sehore's upcoming wheat harvest maturity and flags a critical harvester shortage (+34% surge, 5 units required vs 3 available)."*
- **Visuals**: Review the 7-day regional matrix and Sehore shortage alert.

### Scene 2: Deterministic Fleet Allocation
- **Action**: Click `Scene 2` or click `Approve Relocation`.
- **Narration**: *"Rather than turning farmers away, KisanOps identifies surplus capacity at GreenFields CHC in Bhopal (28km away) and calculates a +21% utilization gain and ₹31,500 revenue ROI for moving Harvester #12."*
- **Visuals**: 1-click approve button executes real-time hub rebalancing.

### Scene 3: Farmer Activity Requirement
- **Action**: Click `Scene 3` or switch to Farmer persona (`/farmer`).
- **Narration**: *"Farmer Ramesh Kumar opens KisanOps on his phone. His 8-acre wheat farm in Bilkisganj is at pre-harvest stage. He taps 'Harvest Crop' without needing to search technical machine catalogues."*

### Scene 4: Explainable Smart Match (94% Fit)
- **Action**: Click `Scene 4` or view `/farmer/marketplace`.
- **Narration**: *"The 7-factor recommendation engine identifies the John Deere W70 Harvester as a 94% match. It explains exactly why: optimal for 8-acre wheat, nearby (3.2km), available immediately, and certified 94% health."*

### Scene 5: Transparent Dynamic Pricing
- **Action**: Click `Scene 5` or click `View Details` on the John Deere card.
- **Narration**: *"KisanOps never hides pricing logic. Ramesh inspects the itemized breakdown: ₹980/hr base, peak demand surge, transit cost, and a -₹20 prime fleet health incentive."*

### Scene 6: AgriCredit Deferred Eligibility
- **Action**: Click `Scene 6` or view `/farmer/credit`.
- **Narration**: *"Ramesh has an AgriCredit score of 742 / 900 based on his past 8 on-time settlements. He is pre-approved for ₹8,000 in deferred operational credit, allowing him to pay post-harvest."*

### Scene 7: Instant Booking Confirmation
- **Action**: Click `Scene 7` or click `Book with AgriCredit`.
- **Narration**: *"Booking BK-2026-8891 is confirmed with zero upfront cash. The CHC operator is instantly notified."*

### Scene 8: CHC Dispatch Workflow
- **Action**: Click `Scene 8` or navigate to `/chc/bookings`.
- **Narration**: *"CHC Manager Rajesh Singh dispatches operator Raju Verma and machine JD-HARV-07 towards Bilkisganj."*

### Scene 9: Live CAN-Bus Telematics Streaming
- **Action**: Click `Scene 9` or navigate to `/chc/telematics`.
- **Narration**: *"The tractor moves along the SH-18 route on the GIS map. Live CAN-Bus telemetry streams GPS, speed, fuel percentage, engine temperature, and RPM every 2 seconds."*

### Scene 10: Predictive Fuel Anomaly Detection
- **Action**: Click `Scene 10` or click `Inject Anomaly` on the top bar.
- **Narration**: *"Fuel consumption spikes +17% above nominal (8.4 L/h vs 7.2 L/h). KisanOps instantly alerts the CHC technician with root-cause advice: 'Inspect fuel injection pressure and clean filter within 24 hours'."*

### Scene 11: Automated Billing & PDF Invoice
- **Action**: Click `Scene 11` or navigate to `/farmer/rentals`.
- **Narration**: *"The rental completes. KisanOps automatically reconciles 6.4 actual operating hours from telematics and generates an itemized tax invoice. Ramesh downloads the PDF with one click."*

### Scene 12: Business Impact & Revenue Analytics
- **Action**: Click `Scene 12` or view `/chc/analytics`.
- **Narration**: *"The CHC dashboard reflects updated Productive Machine Hours (412.5 hrs), 78.4% fleet utilization, and positive unit economics across all hubs."*
