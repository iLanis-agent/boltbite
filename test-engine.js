var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, tol) { if (a === b) { n++; return; } n++; tol = tol == null ? 1e-9 : tol; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
function nm(d, c, f) { return E.spec(d, c, f).torqueNm; }
// published Fastenal ISO 898-1 table (clamp = 75% of proof; T = K d F with K dry 0.20, lube 0.15, flake 0.13)
// clamp loads (N)
eq(E.clampN(10, '8.8'), 25230, 'M10 8.8 clamp', 1); eq(E.clampN(10, '10.9'), 36105, 'M10 10.9 clamp', 1); eq(E.clampN(10, '12.9'), 42195, 'M10 12.9 clamp', 1); eq(E.clampN(10, '4.6'), 9788, 'M10 4.6 clamp', 1);
eq(E.clampN(12, '8.8'), 36671, 'M12 8.8', 1); eq(E.clampN(16, '8.8'), 68295, 'M16 8.8', 1); eq(E.clampN(20, '10.9'), 152513, 'M20 10.9', 1); eq(E.clampN(24, '12.9'), 256808, 'M24 12.9', 1);
eq(E.clampN(6, '4.6'), 3392, 'M6 4.6', 1); eq(E.clampN(36, '4.6'), 137869, 'M36 4.6', 1);
// 8.8 proof stress steps from 580 to 600 MPa above M16
eq(E.clampN(18, '8.8'), 86400, 'M18 8.8', 1); eq(E.clampN(20, '8.8'), 110250, 'M20 8.8', 1); eq(E.clampN(24, '8.8'), 158850, 'M24 8.8', 1); eq(E.proofStress(16, '8.8'), 580, 'ps16'); eq(E.proofStress(18, '8.8'), 600, 'ps18'); eq(E.proofStress(30, '10.9'), 830, 'ps10.9');
// proof loads
eq(E.proofLoadN(8, '8.8'), 21228, 'M8 8.8 proof', 1); eq(E.proofLoadN(10, '12.9'), 56260, 'M10 12.9 proof', 1); eq(E.proofLoadN(16, '4.6'), 35325, 'M16 4.6 proof', 1);
// tensile loads
eq(E.tensileLoadN(10, '8.8'), 46400, 'M10 8.8 tensile', 1); eq(E.tensileLoadN(10, '10.9'), 60320, 'M10 10.9 tensile', 1); eq(E.tensileLoadN(12, '12.9'), 102846, 'M12 12.9 tensile', 1); eq(E.tensileLoadN(5, '4.6'), 5680, 'M5 4.6', 1);
// torques (N m) from the table, 3 significant figures
eq(nm(10, '8.8', 'dry'), 50.5, 'M10 8.8 dry', 0.06); eq(nm(10, '8.8', 'lube'), 37.8, 'M10 8.8 lube', 0.06); eq(nm(10, '8.8', 'flake'), 32.8, 'M10 8.8 flake', 0.06);
eq(nm(8, '8.8', 'dry'), 25.5, 'M8 8.8 dry', 0.06); eq(nm(12, '8.8', 'dry'), 88.0, 'M12 8.8 dry', 0.06); eq(nm(16, '8.8', 'dry'), 219, 'M16 8.8 dry', 0.5); eq(nm(20, '8.8', 'dry'), 441, 'M20 8.8 dry', 0.6); eq(nm(24, '8.8', 'dry'), 762, 'M24 8.8 dry', 1); eq(nm(30, '10.9', 'lube'), 1.0 * E.spec(30, '10.9', 'lube').torqueNm, 'self');
eq(nm(10, '10.9', 'dry'), 72.2, 'M10 10.9 dry', 0.06); eq(nm(12, '10.9', 'dry'), 126, 'M12 10.9 dry', 0.3); eq(nm(10, '12.9', 'dry'), 84.4, 'M10 12.9 dry', 0.06); eq(nm(12, '12.9', 'dry'), 147, 'M12 12.9 dry', 0.3);
eq(nm(10, '12.9', 'flake'), 54.9, 'M10 12.9 flake', 0.06); eq(nm(10, '12.9', 'lube'), 63.3, 'M10 12.9 lube', 0.06); eq(nm(10, '4.6', 'dry'), 19.6, 'M10 4.6 dry', 0.06);
// ft-lb conversion (table: M10 8.8 dry 37.2 ft-lb)
eq(E.toFtLb(50.5), 37.2, 'ft-lb', 0.1); eq(E.toFtLb(1), 0.737562, 'conv');
// tensile stress area consistency: As close to pi/4 (d - 0.9382 p)^2
E.SIZES.forEach(function (s) { var a = Math.PI / 4 * Math.pow(s.d - 0.9382 * s.p, 2); eq(Math.abs(a - s.As) / s.As < 0.01 ? 1 : 0, 1, 'As M' + s.d); });
// relations
var s = E.spec(10, '8.8', 'dry'); eq(s.fracProof, 0.75, 'frac'); eq(s.K, 0.2, 'K'); eq(s.clampKgf, 25230 / 9.80665, 'kgf'); eq(s.torqueNm, 0.2 * 0.01 * s.clampN, 'T=KdF');
eq(E.spec(10, '8.8', 'dry', 0.9).clampN / E.spec(10, '8.8', 'dry', 0.45).clampN, 2, 'frac scale');
// reverse: round trip and scatter band
var r = E.reverse(50.5, 10, '8.8', 'dry'); eq(r.clampN, 25250, 'reverse', 1); eq(r.lowN < r.clampN && r.highN > r.clampN ? 1 : 0, 1, 'band'); eq(r.highN / r.clampN, 1 / 0.75, 'high ratio'); eq(r.lowN / r.clampN, 1 / 1.25, 'low ratio');
eq(E.forceFromTorque(E.torqueNm(12345, 12, 0.15), 12, 0.15), 12345, 'round trip', 1e-6);
// status
eq(E.status(0.75) === 'ok' ? 1 : 0, 1, 's75'); eq(E.status(0.8) === 'ok' ? 1 : 0, 1, 's80'); eq(E.status(0.9) === 'high' ? 1 : 0, 1, 's90'); eq(E.status(1) === 'over' ? 1 : 0, 1, 's100'); eq(E.status(1.3) === 'over' ? 1 : 0, 1, 's130');
// torque monotone in size and class
for (var i = 1; i < E.SIZES.length; i++) eq(nm(E.SIZES[i].d, '8.8', 'dry') > nm(E.SIZES[i - 1].d, '8.8', 'dry') ? 1 : 0, 1, 'mono size' + i);
['4.6', '8.8', '10.9', '12.9'].forEach(function (c, k, a) { if (k) eq(nm(10, c, 'dry') > nm(10, a[k - 1], 'dry') ? 1 : 0, 1, 'mono class ' + c); });
eq(nm(10, '8.8', 'dry') > nm(10, '8.8', 'lube') && nm(10, '8.8', 'lube') > nm(10, '8.8', 'flake') ? 1 : 0, 1, 'lube lowers torque');
eq(E.size(99) === null ? 1 : 0, 1, 'unknown');
console.log(n + ' assertions, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
