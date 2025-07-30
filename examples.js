// Example API usage for the Bajaj Hackathon Document Processing API

// 1. Health Check
const healthCheck = async () => {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('Health Check:', data);
};

// 2. Process existing document
const processDocument = async () => {
    const response = await fetch('http://localhost:3000/api/documents/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fileName: 'bajaj-2.pdf'
        })
    });
    const data = await response.json();
    console.log('Process Document:', data);
};

// 3. Query documents
const queryDocuments = async () => {
    const response = await fetch('http://localhost:3000/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: "What are the eligibility criteria for the insurance policy?",
            documentName: "bajaj-2.pdf"
        })
    });
    const data = await response.json();
    console.log('Query Result:', data);
};

// 4. Get statistics
const getStats = async () => {
    const response = await fetch('http://localhost:3000/api/stats');
    const data = await response.json();
    console.log('Statistics:', data);
};

// 5. List documents
const listDocuments = async () => {
    const response = await fetch('http://localhost:3000/api/documents');
    const data = await response.json();
    console.log('Documents:', data);
};

// 6. Search similar chunks
const searchChunks = async () => {
    const response = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: "insurance policy terms",
            documentName: "bajaj-2.pdf",
            limit: 3
        })
    });
    const data = await response.json();
    console.log('Search Results:', data);
};

// 7. Upload new document (using FormData)
const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await fetch('http://localhost:3000/api/documents/upload', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    console.log('Upload Result:', data);
};

// Example usage in sequence
const runExamples = async () => {
    try {
        console.log('🧪 Running API Examples...\n');
        
        await healthCheck();
        console.log('\n---\n');
        
        await processDocument();
        console.log('\n---\n');
        
        await getStats();
        console.log('\n---\n');
        
        await listDocuments();
        console.log('\n---\n');
        
        await queryDocuments();
        console.log('\n---\n');
        
        await searchChunks();
        
        console.log('\n🎉 All examples completed successfully!');
        
    } catch (error) {
        console.error('❌ Error running examples:', error);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        healthCheck,
        processDocument,
        queryDocuments,
        getStats,
        listDocuments,
        searchChunks,
        uploadDocument,
        runExamples
    };
}

// Run examples if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
    runExamples();
}
