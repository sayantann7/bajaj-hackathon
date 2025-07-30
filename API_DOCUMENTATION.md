# Bajaj Hackathon - Document Processing API

A production-ready Express.js backend for processing PDF documents, generating embeddings, and providing intelligent query responses using OpenAI and Supabase.

## Features

- **PDF Upload & Processing**: Upload PDF files and automatically extract content
- **Vector Embeddings**: Generate and store embeddings for semantic search
- **Few-shot Examples**: Automatically generate training examples from documents
- **Intelligent Querying**: RAG (Retrieval Augmented Generation) with OpenAI
- **Document Management**: Full CRUD operations for documents
- **Rate Limiting**: Built-in rate limiting for API calls
- **Production Ready**: Error handling, logging, and proper middleware

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_api_key
PORT=3000
NODE_ENV=development
```

3. Create the required Supabase tables:
```sql
-- Documents table for storing chunks and embeddings
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536),
    document_name VARCHAR(255) NOT NULL,
    chunk_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Few-shot examples table
CREATE TABLE few_shot_examples (
    id SERIAL PRIMARY KEY,
    document_name VARCHAR(255) NOT NULL,
    few_shot_examples TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_document_name ON documents(document_name);
CREATE INDEX idx_few_shot_examples_document_name ON few_shot_examples(document_name);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id bigint,
    content text,
    document_name text,
    chunk_index int,
    similarity float
)
LANGUAGE sql
AS $$
SELECT
    id,
    content,
    document_name,
    chunk_index,
    1 - (documents.embedding <=> query_embedding) AS similarity
FROM documents
WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
ORDER BY documents.embedding <=> query_embedding
LIMIT match_count;
$$;
```

4. Start the server:
```bash
npm run server
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime.

### Document Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

Form Data:
- pdf: PDF file (max 50MB)
```
Upload a PDF file, extract content, generate embeddings, and create few-shot examples.

### Process Existing Document
```
POST /api/documents/process
Content-Type: application/json

{
  "fileName": "example.pdf"
}
```
Process a PDF file that already exists in the project directory.

### Query Documents
```
POST /api/query
Content-Type: application/json

{
  "query": "What are the eligibility criteria?",
  "documentName": "example.pdf" // optional
}
```
Query documents using natural language and get AI-generated responses.

### Search Similar Chunks
```
POST /api/search
Content-Type: application/json

{
  "query": "search term",
  "documentName": "example.pdf", // optional
  "limit": 5 // optional, default 5
}
```
Search for similar document chunks based on semantic similarity.

### Get Few-shot Examples
```
GET /api/documents/:documentName/examples
```
Retrieve few-shot examples for a specific document.

### List Documents
```
GET /api/documents
```
Get a list of all processed documents with metadata.

### Get Statistics
```
GET /api/stats
```
Get embedding and document statistics.

### Delete Document
```
DELETE /api/documents/:documentName
```
Delete a document and all its associated data (chunks and examples).

## Response Format

All endpoints return JSON responses with the following structure:

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... },
  "timestamp": "2025-01-31T..."
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "details": "Detailed error message",
  "timestamp": "2025-01-31T..."
}
```

## Error Handling

The API includes comprehensive error handling for:
- File upload errors (size, type, etc.)
- OpenAI rate limiting
- Database connection issues
- Invalid requests
- Server errors

## Rate Limiting

Built-in rate limiting for OpenAI API calls:
- Embeddings: 2 requests per batch with 8-second delays
- Chat completions: 5-second delays between requests
- Automatic retry with exponential backoff for rate limit errors

## Development

For development with auto-reload:
```bash
npm run watch
```

Build the project:
```bash
npm run build
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start dist/server.js --name "bajaj-api"
```
3. Set up reverse proxy with nginx
4. Enable HTTPS
5. Set up monitoring and logging

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_API_KEY` | Supabase API key | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **openai**: OpenAI API client
- **@supabase/supabase-js**: Supabase client
- **@langchain/textsplitters**: Text chunking
- **pdf-parse**: PDF content extraction
- **dotenv**: Environment variables
- **typescript**: TypeScript support
