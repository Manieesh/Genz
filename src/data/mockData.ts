// ── Types ──────────────────────────────────────────────────

export interface ReviewStats {
  totalLines: number;
  linesAnalyzed: number;
  tokensUsed: number;
  tokenLimit: number;
  compressionRatio: number;
  filesScanned: number;
  filesIncluded: number;
  filesExcluded: number;
  processingTimeMs: number;
}

export interface IssueCounts {
  critical: number;
  warning: number;
  nit: number;
  total: number;
}

export interface Review {
  id: string;
  repository: string;
  branch: string;
  author: string;
  timestamp: string;
  status: "completed" | "in_progress" | "failed";
  stats: ReviewStats;
  issueCount: IssueCounts;
}

export type Severity = "critical" | "warning" | "nit";

export interface Issue {
  id: string;
  reviewId: string;
  severity: Severity;
  category: string;
  file: string;
  line: number;
  title: string;
  description: string;
  reasoning: string;
  codeBefore: string;
  codeAfter: string;
  language: string;
  feedback: { helpful: number; notHelpful: number };
  status: "open" | "dismissed" | "fixed";
  autoFixAvailable: boolean;
}

export type NodeStatus = "included" | "excluded" | "partial";

export interface GraphNode {
  id: string;
  label: string;
  path: string;
  status: NodeStatus;
  lines: number;
  tokensUsed: number;
  reason: string;
  importance: number;
  category: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "imports" | "indirect";
  strength: number;
}

export interface ContextGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── Mock Reviews ───────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: "rev_001",
    repository: "acme-corp/ecommerce-platform",
    branch: "feature/checkout-optimization",
    author: "sarah.dev",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    stats: {
      totalLines: 5247,
      linesAnalyzed: 1823,
      tokensUsed: 412,
      tokenLimit: 8000,
      compressionRatio: 0.921,
      filesScanned: 48,
      filesIncluded: 14,
      filesExcluded: 34,
      processingTimeMs: 2300,
    },
    issueCount: { critical: 2, warning: 5, nit: 3, total: 10 },
  },
  {
    id: "rev_002",
    repository: "acme-corp/ecommerce-platform",
    branch: "main",
    author: "alex.eng",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    stats: {
      totalLines: 3100,
      linesAnalyzed: 890,
      tokensUsed: 210,
      tokenLimit: 8000,
      compressionRatio: 0.934,
      filesScanned: 32,
      filesIncluded: 8,
      filesExcluded: 24,
      processingTimeMs: 1800,
    },
    issueCount: { critical: 0, warning: 0, nit: 0, total: 0 },
  },
  {
    id: "rev_003",
    repository: "acme-corp/ecommerce-platform",
    branch: "bugfix/auth-token-refresh",
    author: "maya.sec",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    stats: {
      totalLines: 1890,
      linesAnalyzed: 645,
      tokensUsed: 178,
      tokenLimit: 8000,
      compressionRatio: 0.906,
      filesScanned: 22,
      filesIncluded: 6,
      filesExcluded: 16,
      processingTimeMs: 1400,
    },
    issueCount: { critical: 1, warning: 2, nit: 4, total: 7 },
  },
  {
    id: "rev_004",
    repository: "acme-corp/ecommerce-platform",
    branch: "feature/user-dashboard",
    author: "james.ui",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    stats: {
      totalLines: 4100,
      linesAnalyzed: 1200,
      tokensUsed: 340,
      tokenLimit: 8000,
      compressionRatio: 0.917,
      filesScanned: 38,
      filesIncluded: 12,
      filesExcluded: 26,
      processingTimeMs: 2800,
    },
    issueCount: { critical: 0, warning: 3, nit: 6, total: 9 },
  },
  {
    id: "rev_005",
    repository: "acme-corp/ecommerce-platform",
    branch: "hotfix/rate-limiter",
    author: "sarah.dev",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    stats: {
      totalLines: 980,
      linesAnalyzed: 320,
      tokensUsed: 95,
      tokenLimit: 8000,
      compressionRatio: 0.903,
      filesScanned: 12,
      filesIncluded: 4,
      filesExcluded: 8,
      processingTimeMs: 900,
    },
    issueCount: { critical: 1, warning: 1, nit: 1, total: 3 },
  },
];

// ── Mock Issues ────────────────────────────────────────────

export const mockIssues: Issue[] = [
  {
    id: "iss_001",
    reviewId: "rev_001",
    severity: "critical",
    category: "Security",
    file: "src/controllers/paymentController.js",
    line: 45,
    title: "SQL Injection Vulnerability",
    description:
      "User input is directly concatenated into SQL query without proper sanitization, allowing potential SQL injection attacks.",
    reasoning:
      "String concatenation with user input creates injection vectors. Parameterized queries separate data from SQL commands, preventing malicious manipulation of the query structure.",
    codeBefore: `const userId = req.params.id;
const query = \`SELECT * FROM orders 
  WHERE user_id = \${userId}\`;
db.execute(query);`,
    codeAfter: `const userId = req.params.id;
const query = "SELECT * FROM orders WHERE user_id = ?";
db.execute(query, [userId]);`,
    language: "javascript",
    feedback: { helpful: 12, notHelpful: 1 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_002",
    reviewId: "rev_001",
    severity: "critical",
    category: "Security",
    file: "src/middleware/authMiddleware.js",
    line: 23,
    title: "JWT Token Not Verified",
    description:
      "JWT token is decoded but never verified against the secret key, allowing forged tokens to pass authentication.",
    reasoning:
      "jwt.decode() only parses the payload without verification. jwt.verify() validates the signature, ensuring the token hasn't been tampered with.",
    codeBefore: `const token = req.headers.authorization;
const decoded = jwt.decode(token);
req.user = decoded;
next();`,
    codeAfter: `const token = req.headers.authorization?.split(' ')[1];
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  res.status(401).json({ error: 'Invalid token' });
}`,
    language: "javascript",
    feedback: { helpful: 18, notHelpful: 0 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_003",
    reviewId: "rev_001",
    severity: "warning",
    category: "Performance",
    file: "src/utils/arrayProcessor.js",
    line: 89,
    title: "Nested Loop Inefficiency — O(n²)",
    description:
      "Nested loop creates quadratic time complexity. For large datasets this will cause significant slowdowns.",
    reasoning:
      "Converting one array to a Set provides O(1) lookups, reducing overall complexity from O(n²) to O(n).",
    codeBefore: `const result = [];
for (const item of listA) {
  for (const other of listB) {
    if (item.id === other.id) {
      result.push({ ...item, ...other });
    }
  }
}`,
    codeAfter: `const mapB = new Map(listB.map(b => [b.id, b]));
const result = listA
  .filter(a => mapB.has(a.id))
  .map(a => ({ ...a, ...mapB.get(a.id) }));`,
    language: "javascript",
    feedback: { helpful: 8, notHelpful: 2 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_004",
    reviewId: "rev_001",
    severity: "warning",
    category: "Performance",
    file: "src/services/productService.js",
    line: 34,
    title: "Unbounded Database Query",
    description:
      "Query fetches all records without pagination or limit, which can cause memory issues and slow response times.",
    reasoning:
      "Adding LIMIT and OFFSET prevents loading the entire table into memory and enables efficient pagination for the client.",
    codeBefore: `async function getAllProducts() {
  return db.query("SELECT * FROM products");
}`,
    codeAfter: `async function getProducts(page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  return db.query(
    "SELECT * FROM products LIMIT ? OFFSET ?",
    [limit, offset]
  );
}`,
    language: "javascript",
    feedback: { helpful: 6, notHelpful: 1 },
    status: "open",
    autoFixAvailable: false,
  },
  {
    id: "iss_005",
    reviewId: "rev_001",
    severity: "warning",
    category: "Error Handling",
    file: "src/controllers/paymentController.js",
    line: 78,
    title: "Unhandled Promise Rejection",
    description:
      "Async function lacks try/catch, meaning any rejection will crash the process or go unhandled.",
    reasoning:
      "Wrapping async operations in try/catch with proper error responses prevents unhandled rejections and gives clients meaningful error messages.",
    codeBefore: `app.post('/charge', async (req, res) => {
  const result = await stripe.charges.create({
    amount: req.body.amount,
    currency: 'usd',
    source: req.body.token,
  });
  res.json(result);
});`,
    codeAfter: `app.post('/charge', async (req, res) => {
  try {
    const result = await stripe.charges.create({
      amount: req.body.amount,
      currency: 'usd',
      source: req.body.token,
    });
    res.json(result);
  } catch (error) {
    console.error('Payment failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});`,
    language: "javascript",
    feedback: { helpful: 4, notHelpful: 0 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_006",
    reviewId: "rev_001",
    severity: "warning",
    category: "Best Practice",
    file: "src/config/database.js",
    line: 12,
    title: "Hardcoded Database Credentials",
    description:
      "Database credentials are hardcoded in source code instead of using environment variables.",
    reasoning:
      "Hardcoded credentials can be exposed through version control. Environment variables keep secrets out of the codebase.",
    codeBefore: `const db = mysql.createConnection({
  host: 'prod-db.acme.com',
  user: 'admin',
  password: 'supersecret123',
  database: 'ecommerce'
});`,
    codeAfter: `const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});`,
    language: "javascript",
    feedback: { helpful: 15, notHelpful: 0 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_007",
    reviewId: "rev_001",
    severity: "warning",
    category: "Security",
    file: "src/routes/userRoutes.js",
    line: 56,
    title: "Missing Input Validation",
    description: "User input from request body is used directly without validation or sanitization.",
    reasoning:
      "Input validation prevents malformed data from reaching business logic and protects against injection attacks.",
    codeBefore: `app.post('/users', (req, res) => {
  const { name, email, role } = req.body;
  db.query('INSERT INTO users ...', [name, email, role]);
});`,
    codeAfter: `import { z } from 'zod';
const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

app.post('/users', (req, res) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  db.query('INSERT INTO users ...', Object.values(parsed.data));
});`,
    language: "javascript",
    feedback: { helpful: 9, notHelpful: 1 },
    status: "open",
    autoFixAvailable: false,
  },
  {
    id: "iss_008",
    reviewId: "rev_001",
    severity: "nit",
    category: "Code Style",
    file: "src/utils/helpers.js",
    line: 12,
    title: "Inconsistent Naming Convention",
    description: "Mix of camelCase and snake_case naming in the same module.",
    reasoning: "Consistent naming improves readability and reduces cognitive load across the team.",
    codeBefore: `const user_name = getUser();
const userEmail = user_name.email;
const user_role = getUserRole();`,
    codeAfter: `const userName = getUser();
const userEmail = userName.email;
const userRole = getUserRole();`,
    language: "javascript",
    feedback: { helpful: 3, notHelpful: 2 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_009",
    reviewId: "rev_001",
    severity: "nit",
    category: "Code Style",
    file: "src/controllers/orderController.js",
    line: 102,
    title: "Unused Import Statement",
    description: "The 'lodash' module is imported but never used in this file.",
    reasoning: "Unused imports increase bundle size and add confusion about actual dependencies.",
    codeBefore: `import _ from 'lodash';
import { OrderService } from './orderService';

export const getOrders = async (req, res) => {
  const orders = await OrderService.findAll();
  res.json(orders);
};`,
    codeAfter: `import { OrderService } from './orderService';

export const getOrders = async (req, res) => {
  const orders = await OrderService.findAll();
  res.json(orders);
};`,
    language: "javascript",
    feedback: { helpful: 2, notHelpful: 1 },
    status: "open",
    autoFixAvailable: true,
  },
  {
    id: "iss_010",
    reviewId: "rev_001",
    severity: "nit",
    category: "Documentation",
    file: "src/services/emailService.js",
    line: 1,
    title: "Missing JSDoc for Public API",
    description: "Public function exported without documentation describing parameters and return type.",
    reasoning: "JSDoc comments enable IDE autocompletion and serve as inline documentation for teammates.",
    codeBefore: `export async function sendEmail(to, subject, body) {
  // ...
}`,
    codeAfter: `/**
 * Send a transactional email.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} body - HTML email body
 * @returns {Promise<{id: string}>} Sent message metadata
 */
export async function sendEmail(to, subject, body) {
  // ...
}`,
    language: "javascript",
    feedback: { helpful: 1, notHelpful: 0 },
    status: "open",
    autoFixAvailable: true,
  },
];

// ── Mock Context Graph ─────────────────────────────────────

export const mockContextGraph: ContextGraph = {
  nodes: [
    { id: "payment-ctrl", label: "paymentController.js", path: "src/controllers/paymentController.js", status: "included", lines: 234, tokensUsed: 89, reason: "Modified in this PR — contains critical payment logic", importance: 0.95, category: "controller", x: 400, y: 200 },
    { id: "auth-mw", label: "authMiddleware.js", path: "src/middleware/authMiddleware.js", status: "included", lines: 156, tokensUsed: 67, reason: "Direct dependency — imported by modified file", importance: 0.82, category: "middleware", x: 250, y: 120 },
    { id: "user-model", label: "userModel.js", path: "src/models/userModel.js", status: "included", lines: 198, tokensUsed: 72, reason: "Data model used by payment controller", importance: 0.78, category: "model", x: 550, y: 130 },
    { id: "order-model", label: "orderModel.js", path: "src/models/orderModel.js", status: "included", lines: 167, tokensUsed: 58, reason: "Order schema referenced in checkout flow", importance: 0.75, category: "model", x: 560, y: 280 },
    { id: "stripe-svc", label: "stripeService.js", path: "src/services/stripeService.js", status: "included", lines: 312, tokensUsed: 104, reason: "Payment gateway integration — core to changes", importance: 0.92, category: "service", x: 400, y: 350 },
    { id: "email-svc", label: "emailService.js", path: "src/services/emailService.js", status: "included", lines: 89, tokensUsed: 34, reason: "Sends order confirmation — triggered by payment", importance: 0.6, category: "service", x: 280, y: 380 },
    { id: "order-ctrl", label: "orderController.js", path: "src/controllers/orderController.js", status: "included", lines: 289, tokensUsed: 95, reason: "Handles order creation called after payment", importance: 0.85, category: "controller", x: 530, y: 410 },
    { id: "validator", label: "validator.js", path: "src/utils/validator.js", status: "included", lines: 78, tokensUsed: 28, reason: "Input validation for payment data", importance: 0.55, category: "util", x: 180, y: 230 },
    { id: "db-config", label: "database.js", path: "src/config/database.js", status: "included", lines: 45, tokensUsed: 18, reason: "Database connection — hardcoded credentials flagged", importance: 0.5, category: "config", x: 680, y: 200 },
    { id: "logger", label: "logger.js", path: "src/utils/logger.js", status: "included", lines: 56, tokensUsed: 22, reason: "Logging utility used in payment error handling", importance: 0.45, category: "util", x: 150, y: 340 },
    { id: "array-proc", label: "arrayProcessor.js", path: "src/utils/arrayProcessor.js", status: "included", lines: 134, tokensUsed: 45, reason: "Contains performance issue flagged by analysis", importance: 0.65, category: "util", x: 100, y: 160 },
    { id: "user-routes", label: "userRoutes.js", path: "src/routes/userRoutes.js", status: "included", lines: 112, tokensUsed: 42, reason: "Route definitions with input validation issues", importance: 0.62, category: "route", x: 340, y: 80 },
    { id: "product-svc", label: "productService.js", path: "src/services/productService.js", status: "included", lines: 187, tokensUsed: 68, reason: "Product queries — unbounded query issue found", importance: 0.7, category: "service", x: 680, y: 350 },
    { id: "helpers", label: "helpers.js", path: "src/utils/helpers.js", status: "included", lines: 92, tokensUsed: 35, reason: "Utility functions with naming inconsistencies", importance: 0.4, category: "util", x: 80, y: 280 },
    // Excluded nodes
    { id: "readme", label: "README.md", path: "README.md", status: "excluded", lines: 89, tokensUsed: 0, reason: "Documentation file — no executable code", importance: 0.05, category: "docs", x: 750, y: 80 },
    { id: "jest-config", label: "jest.config.js", path: "jest.config.js", status: "excluded", lines: 34, tokensUsed: 0, reason: "Test configuration — excluded by policy", importance: 0.08, category: "config", x: 800, y: 150 },
    { id: "webpack", label: "webpack.config.js", path: "webpack.config.js", status: "excluded", lines: 156, tokensUsed: 0, reason: "Build configuration — no runtime impact", importance: 0.1, category: "config", x: 830, y: 250 },
    { id: "eslint", label: ".eslintrc.js", path: ".eslintrc.js", status: "excluded", lines: 45, tokensUsed: 0, reason: "Linter configuration — static analysis only", importance: 0.05, category: "config", x: 780, y: 330 },
    { id: "test-payment", label: "payment.test.js", path: "src/__tests__/payment.test.js", status: "excluded", lines: 234, tokensUsed: 0, reason: "Test file — excluded by default policy", importance: 0.12, category: "test", x: 820, y: 420 },
    { id: "test-auth", label: "auth.test.js", path: "src/__tests__/auth.test.js", status: "excluded", lines: 189, tokensUsed: 0, reason: "Test file — excluded by default policy", importance: 0.1, category: "test", x: 750, y: 450 },
    { id: "package", label: "package.json", path: "package.json", status: "excluded", lines: 67, tokensUsed: 0, reason: "Dependency manifest — no logic", importance: 0.03, category: "config", x: 870, y: 100 },
    { id: "docker", label: "Dockerfile", path: "Dockerfile", status: "excluded", lines: 28, tokensUsed: 0, reason: "Container config — excluded by policy", importance: 0.05, category: "config", x: 850, y: 370 },
    { id: "env-example", label: ".env.example", path: ".env.example", status: "excluded", lines: 12, tokensUsed: 0, reason: "Template file — no secrets or logic", importance: 0.02, category: "config", x: 900, y: 200 },
    { id: "migrations", label: "migrations/", path: "src/migrations/", status: "partial", lines: 456, tokensUsed: 15, reason: "Schema changes partially scanned for model validation", importance: 0.3, category: "migration", x: 680, y: 460 },
    { id: "seed-data", label: "seedData.js", path: "src/seeds/seedData.js", status: "partial", lines: 178, tokensUsed: 8, reason: "Seed data partially analyzed for schema consistency", importance: 0.2, category: "seed", x: 600, y: 500 },
  ],
  edges: [
    { source: "payment-ctrl", target: "auth-mw", type: "imports", strength: 0.9 },
    { source: "payment-ctrl", target: "stripe-svc", type: "imports", strength: 0.95 },
    { source: "payment-ctrl", target: "order-model", type: "imports", strength: 0.8 },
    { source: "payment-ctrl", target: "validator", type: "imports", strength: 0.7 },
    { source: "payment-ctrl", target: "logger", type: "imports", strength: 0.5 },
    { source: "auth-mw", target: "user-model", type: "imports", strength: 0.85 },
    { source: "auth-mw", target: "logger", type: "imports", strength: 0.4 },
    { source: "order-ctrl", target: "order-model", type: "imports", strength: 0.9 },
    { source: "order-ctrl", target: "email-svc", type: "imports", strength: 0.7 },
    { source: "order-ctrl", target: "stripe-svc", type: "imports", strength: 0.6 },
    { source: "order-ctrl", target: "product-svc", type: "imports", strength: 0.5 },
    { source: "stripe-svc", target: "db-config", type: "imports", strength: 0.6 },
    { source: "stripe-svc", target: "logger", type: "imports", strength: 0.4 },
    { source: "user-model", target: "db-config", type: "imports", strength: 0.8 },
    { source: "order-model", target: "db-config", type: "imports", strength: 0.8 },
    { source: "product-svc", target: "db-config", type: "imports", strength: 0.7 },
    { source: "product-svc", target: "order-model", type: "indirect", strength: 0.3 },
    { source: "user-routes", target: "auth-mw", type: "imports", strength: 0.8 },
    { source: "user-routes", target: "user-model", type: "imports", strength: 0.7 },
    { source: "user-routes", target: "validator", type: "imports", strength: 0.6 },
    { source: "array-proc", target: "helpers", type: "imports", strength: 0.5 },
    { source: "email-svc", target: "logger", type: "imports", strength: 0.3 },
    { source: "migrations", target: "db-config", type: "indirect", strength: 0.4 },
    { source: "seed-data", target: "db-config", type: "indirect", strength: 0.3 },
    { source: "seed-data", target: "user-model", type: "indirect", strength: 0.2 },
    { source: "test-payment", target: "payment-ctrl", type: "imports", strength: 0.6 },
    { source: "test-auth", target: "auth-mw", type: "imports", strength: 0.6 },
  ],
};

// ── Analytics Data ─────────────────────────────────────────

export const issuesOverTime = [
  { day: "Mon", critical: 3, warning: 8, nit: 5 },
  { day: "Tue", critical: 5, warning: 12, nit: 8 },
  { day: "Wed", critical: 2, warning: 15, nit: 10 },
  { day: "Thu", critical: 7, warning: 10, nit: 6 },
  { day: "Fri", critical: 4, warning: 8, nit: 12 },
  { day: "Sat", critical: 1, warning: 3, nit: 4 },
  { day: "Sun", critical: 2, warning: 5, nit: 3 },
];

export const issuesByCategory = [
  { category: "Security", count: 23, color: "hsl(0, 72%, 51%)" },
  { category: "Performance", count: 34, color: "hsl(25, 95%, 53%)" },
  { category: "Code Style", count: 28, color: "hsl(217, 91%, 60%)" },
  { category: "Best Practice", count: 18, color: "hsl(258, 90%, 66%)" },
  { category: "Error Handling", count: 15, color: "hsl(160, 84%, 39%)" },
  { category: "Documentation", count: 8, color: "hsl(38, 92%, 50%)" },
];

export const tokenUsageTrend = [
  { week: "W1", tokens: 2400, limit: 8000 },
  { week: "W2", tokens: 3100, limit: 8000 },
  { week: "W3", tokens: 2800, limit: 8000 },
  { week: "W4", tokens: 3400, limit: 8000 },
  { week: "W5", tokens: 2900, limit: 8000 },
  { week: "W6", tokens: 3200, limit: 8000 },
  { week: "W7", tokens: 2600, limit: 8000 },
];

export const topIssues = [
  { type: "SQL Injection Risk", count: 23, trend: "+12%", direction: "up" as const },
  { type: "Inefficient Loop (O(n²))", count: 18, trend: "0%", direction: "flat" as const },
  { type: "Missing Input Validation", count: 15, trend: "-8%", direction: "down" as const },
  { type: "Inconsistent Naming", count: 12, trend: "+5%", direction: "up" as const },
  { type: "Unused Imports", count: 10, trend: "-15%", direction: "down" as const },
  { type: "Unhandled Promises", count: 8, trend: "+3%", direction: "up" as const },
];

// Helper to format relative time
export function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
