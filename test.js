const fs = require("fs");

// Helper: Convert value from given base to BigInt
function decodeValue(value, base) {
  return BigInt(parseInt(value, base));
}

// Helper: Calculate Lagrange interpolation at x = 0
function lagrangeInterpolationAtZero(points) {
  let result = 0n;
  const k = points.length;

  for (let i = 0; i < k; i++) {
    let xi = BigInt(points[i][0]);
    let yi = BigInt(points[i][1]);

    let numerator = 1n;
    let denominator = 1n;

    for (let j = 0; j < k; j++) {
      if (j === i) continue;
      let xj = BigInt(points[j][0]);
      numerator *= -xj;
      denominator *= (xi - xj);
    }

    // yi * (numerator / denominator)
    result += yi * numerator / denominator;
  }

  return result;
}

// Process a single test case object
function processTestCase(data) {
  const n = data["keys"]["n"];
  const k = data["keys"]["k"];

  let points = [];

  for (let i = 1; i <= n; i++) {
    const entry = data[i.toString()];
    if (!entry) continue;

    const x = i;
    const base = parseInt(entry.base);
    const y = decodeValue(entry.value, base);
    points.push([x, y]);

    if (points.length === k) break;
  }

  const secret = lagrangeInterpolationAtZero(points);
  return secret.toString();
}

// Read the JSON file containing both test cases
const filePath = "input.json"; // Replace with your actual file path
const fileContent = fs.readFileSync(filePath, "utf8");

// If multiple test cases are in separate JSON objects:
const testCases = JSON.parse(fileContent);

// Process both test cases
const results = [];

if (Array.isArray(testCases)) {
  for (const testCase of testCases) {
    const result = processTestCase(testCase);
    results.push(result);
  }
} else {
  // Single test case
  const result = processTestCase(testCases);
  results.push(result);
}

// Print the secrets
console.log("Secrets:");
results.forEach((res, idx) => {
  console.log(`Test Case ${idx + 1}: ${res}`);
});
