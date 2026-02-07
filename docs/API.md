# API Reference

## Data Structures

### Analysis Request

```typescript
interface AnalysisRequest {
  fileName: string;
  fileContent: string;
  language: SupportedLanguage;
  analysisLevel?: AnalysisLevel; // default: 'standard'
  includeSecurityChecks?: boolean; // default: true
  includePerformanceAnalysis?: boolean; // default: true
}
```

### Analysis Result

```typescript
interface AnalysisResult {
  id: string;
  fileName: string;
  language: SupportedLanguage;
  timestamp: Date;
  summary: {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
  issues: Issue[];
  analysisTime: number; // milliseconds
}
```

### Issue

```typescript
interface Issue {
  id: string;
  type: IssueType;
  severity: Severity;
  line: number;
  column: number;
  message: string;
  code: string; // snippet of problem code
  suggestion?: string; // recommended fix
  reference?: string; // link to documentation
  confidence: number; // 0-1
}
```

### Enums

#### SupportedLanguage

```typescript
type SupportedLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'ruby';
```

#### AnalysisLevel

```typescript
type AnalysisLevel = 'basic' | 'standard' | 'deep';
```

#### IssueType

```typescript
type IssueType = 
  | 'bug'
  | 'security'
  | 'performance'
  | 'style'
  | 'complexity';
```

#### Severity

```typescript
type Severity = 'critical' | 'high' | 'medium' | 'low';
```

## API Endpoints (When Backend is Implemented)

### POST /api/analyze

Analyze code and return issues.

**Request:**
```json
{
  "fileName": "app.js",
  "fileContent": "const x = 1; const x = 2;",
  "language": "javascript",
  "analysisLevel": "standard"
}
```

**Response:**
```json
{
  "id": "analysis-123",
  "fileName": "app.js",
  "language": "javascript",
  "timestamp": "2024-02-08T10:30:00Z",
  "summary": {
    "totalIssues": 1,
    "criticalCount": 0,
    "highCount": 1,
    "mediumCount": 0,
    "lowCount": 0
  },
  "issues": [
    {
      "id": "issue-1",
      "type": "error",
      "severity": "high",
      "line": 1,
      "column": 27,
      "message": "Variable 'x' is already declared",
      "code": "const x = 2;",
      "suggestion": "Use a different variable name or remove duplicate declaration",
      "confidence": 0.99
    }
  ],
  "analysisTime": 245
}
```

### GET /api/history

Retrieve analysis history.

**Query Parameters:**
- `limit` (optional): Max items to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `language` (optional): Filter by language

**Response:**
```json
{
  "total": 45,
  "items": [
    {
      "id": "analysis-123",
      "fileName": "app.js",
      "language": "javascript",
      "timestamp": "2024-02-08T10:30:00Z",
      "summary": {
        "totalIssues": 1,
        "criticalCount": 0,
        "highCount": 1,
        "mediumCount": 0,
        "lowCount": 0
      }
    }
  ]
}
```

### GET /api/analysis/:id

Get a specific analysis result.

**Response:**
```json
{
  "id": "analysis-123",
  "fileName": "app.js",
  "language": "javascript",
  "timestamp": "2024-02-08T10:30:00Z",
  "summary": { /* ... */ },
  "issues": [ /* ... */ ],
  "analysisTime": 245
}
```

### DELETE /api/analysis/:id

Delete a specific analysis.

**Response:**
```json
{
  "success": true,
  "message": "Analysis deleted successfully"
}
```

### DELETE /api/history

Clear all analysis history.

**Query Parameters:**
- `olderThan` (optional): Delete analyses older than this date (format: ISO 8601)

**Response:**
```json
{
  "success": true,
  "deletedCount": 42
}
```

### GET /api/settings

Get user settings.

**Response:**
```json
{
  "analysisLevel": "standard",
  "includeSecurityChecks": true,
  "includePerformanceAnalysis": true,
  "autoClearHistory": false,
  "autoClearAfterDays": 30,
  "theme": "dark"
}
```

### PUT /api/settings

Update user settings.

**Request:**
```json
{
  "analysisLevel": "deep",
  "includeSecurityChecks": true,
  "includePerformanceAnalysis": true,
  "autoClearHistory": true,
  "autoClearAfterDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "analysisLevel": "deep",
    "includeSecurityChecks": true,
    "includePerformanceAnalysis": true,
    "autoClearHistory": true,
    "autoClearAfterDays": 30,
    "theme": "dark"
  }
}
```

## React Hooks (Frontend)

### useAnalysis

Hook for managing analysis state and operations.

```typescript
function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(request: AnalysisRequest): Promise<void> {
    setLoading(true);
    try {
      // Make API call
      const result = await api.analyze(request);
      setResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, analyze };
}
```

### useHistory

Hook for managing analysis history.

```typescript
function useHistory() {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchHistory(): Promise<void> {
    // Fetch history items
  }

  async function deleteAnalysis(id: string): Promise<void> {
    // Delete specific analysis
  }

  async function clearHistory(): Promise<void> {
    // Clear all history
  }

  return { items, loading, fetchHistory, deleteAnalysis, clearHistory };
}
```

### useSettings

Hook for managing user settings.

```typescript
function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchSettings(): Promise<void> {
    // Fetch user settings
  }

  async function updateSettings(partial: Partial<Settings>): Promise<void> {
    // Update user settings
  }

  return { settings, loading, fetchSettings, updateSettings };
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "File type not supported",
    "details": {
      "receivedType": ".txt",
      "supportedTypes": [".js", ".ts", ".py"]
    }
  }
}
```

### Common Error Codes

| Code | Message | Status |
|------|---------|--------|
| `INVALID_FILE_TYPE` | File type not supported | 400 |
| `FILE_TOO_LARGE` | File exceeds maximum size | 413 |
| `INVALID_LANGUAGE` | Language not supported | 400 |
| `EMPTY_FILE` | File content is empty | 400 |
| `ANALYSIS_FAILED` | Analysis failed due to error | 500 |
| `NOT_FOUND` | Analysis not found | 404 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `RATE_LIMITED` | Too many requests | 429 |

## Rate Limiting

API has the following rate limits:

- **Authenticated users**: 100 requests per hour
- **Anonymous users**: 10 requests per hour
- **File size**: Maximum 5MB per file

Headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707389400
```

## Authentication (Future)

When authentication is implemented:

```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Logout
POST /api/auth/logout

// Refresh token
POST /api/auth/refresh
```

Bearer token in requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```
