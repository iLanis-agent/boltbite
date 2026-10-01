# BoltBite

Metric bolt torque and clamp load calculator (ISO 898-1 classes 4.6, 8.8, 10.9, 12.9; M5 to M39 coarse thread).

- T = K x d x F, F = preload fraction (default 75%) x proof load
- Proof load = tensile stress area x proof stress (8.8: 580 MPa up to M16, 600 MPa above; 4.6: 225; 10.9: 830; 12.9: 970)
- K (estimated): 0.20 dry, 0.15 lubricated, 0.13 zinc flake
- Reverse check: clamp load from an applied torque, with +-25% friction scatter

Tests are anchored to the published Fastenal ISO 898-1 torque-tension table. Advisory only; use the manufacturer's spec for critical joints.

Static client-side. `node test-engine.js` runs the tests.
Source: https://crafter.fastenal.com/static-assets/pdfs/technical-resources/Torque-Tension-Relationship-for-Metric-Fasteners-Property-Class-4.6-8.8-10.9-12.9.pdf
