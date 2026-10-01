(function (root) {
  'use strict';
  // ISO 898-1 coarse-thread bolts. As = tensile stress area (mm2). Strengths in MPa.
  var SIZES = [
    { d: 5, p: 0.8, As: 14.2 }, { d: 6, p: 1, As: 20.1 }, { d: 8, p: 1.25, As: 36.6 }, { d: 10, p: 1.5, As: 58 }, { d: 12, p: 1.75, As: 84.3 },
    { d: 14, p: 2, As: 115 }, { d: 16, p: 2, As: 157 }, { d: 18, p: 2.5, As: 192 }, { d: 20, p: 2.5, As: 245 }, { d: 22, p: 2.5, As: 303 },
    { d: 24, p: 3, As: 353 }, { d: 27, p: 3, As: 459 }, { d: 30, p: 3.5, As: 561 }, { d: 33, p: 3.5, As: 694 }, { d: 36, p: 4, As: 817 }, { d: 39, p: 4, As: 976 }
  ];
  var CLASSES = { '4.6': { tensile: 400, proof: 225 }, '8.8': { tensile: 800, proof: 580 }, '10.9': { tensile: 1040, proof: 830 }, '12.9': { tensile: 1220, proof: 970 } };
  // Nut factor K in T = K d F (typical, estimated)
  var FINISH = { dry: { name: 'Dry (plain steel)', K: 0.20 }, lube: { name: 'Lightly oiled / lubricated', K: 0.15 }, flake: { name: 'Zinc flake coating', K: 0.13 } };
  var PRELOAD = 0.75; // fraction of proof load, commonly used for reusable joints
  var NM_TO_FTLB = 0.737562;
  function size(d) { for (var i = 0; i < SIZES.length; i++) if (SIZES[i].d === d) return SIZES[i]; return null; }
  // ISO 898-1: class 8.8 proof stress is 580 MPa up to M16 and 600 MPa above
  function proofStress(d, cls) { return cls === '8.8' && d > 16 ? 600 : CLASSES[cls].proof; }
  function proofLoadN(d, cls) { return size(d).As * proofStress(d, cls); }
  function tensileLoadN(d, cls) { return size(d).As * CLASSES[cls].tensile; }
  function clampN(d, cls, frac) { return proofLoadN(d, cls) * (frac == null ? PRELOAD : frac); }
  // torque in N m from clamp force (N), diameter d (mm), nut factor K
  function torqueNm(F, d, K) { return K * (d / 1000) * F; }
  function forceFromTorque(T, d, K) { return T / (K * d / 1000); }
  function toFtLb(nm) { return nm * NM_TO_FTLB; }
  function spec(d, cls, finish, frac) {
    var K = FINISH[finish].K, F = clampN(d, cls, frac);
    var T = torqueNm(F, d, K);
    return { d: d, cls: cls, K: K, clampN: F, proofN: proofLoadN(d, cls), tensileN: tensileLoadN(d, cls), torqueNm: T, torqueFtLb: toFtLb(T), clampKgf: F / 9.80665, fracProof: F / proofLoadN(d, cls) };
  }
  // reverse: what clamp load does a torque give; K scatter of +-25% is a typical range for real joints
  function reverse(T, d, cls, finish, scatter) {
    var K = FINISH[finish].K, s = scatter == null ? 0.25 : scatter;
    var F = forceFromTorque(T, d, K), proof = proofLoadN(d, cls);
    return { clampN: F, lowN: forceFromTorque(T, d, K * (1 + s)), highN: forceFromTorque(T, d, K * (1 - s)), proofN: proof, fracProof: F / proof, highFracProof: forceFromTorque(T, d, K * (1 - s)) / proof };
  }
  function status(frac) { return frac <= 0.8 ? 'ok' : frac < 1 ? 'high' : 'over'; }
  var api = { proofStress: proofStress, SIZES: SIZES, CLASSES: CLASSES, FINISH: FINISH, PRELOAD: PRELOAD, size: size, proofLoadN: proofLoadN, tensileLoadN: tensileLoadN, clampN: clampN,
    torqueNm: torqueNm, forceFromTorque: forceFromTorque, toFtLb: toFtLb, spec: spec, reverse: reverse, status: status };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.BoltBite = api;
})(typeof window !== 'undefined' ? window : this);
