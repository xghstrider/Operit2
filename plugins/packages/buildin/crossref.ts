/* METADATA
{
    "name": "crossref",
    "display_name": {
        "zh": "Crossref Scholarly Literature Search",
        "en": "Crossref Academic Literature Search"
    },
    "description": {
        "zh": "Crossref scholarly literature search tool, providing DOI lookup, keyword search, author search, and other functions to help users find and retrieve scholarly article metadata.",
        "en": "Crossref scholarly literature search tools: query by DOI, keyword, author, title, ISSN, and retrieve publication metadata."
    },
    "category": "Search",
    "enabledByDefault": true,
    "tools": [
        {
            "name": "search_by_doi",
            "description": { "zh": "Query article details by DOI (Digital Object Identifier).", "en": "Query article details by DOI (Digital Object Identifier)." },
            "parameters": [
                {
                    "name": "doi",
                    "description": { "zh": "DOI identifier, e.g. '10.1038/nature12373'", "en": "DOI identifier, e.g. '10.1038/nature12373'" },
                    "type": "string",
                    "required": true
                }
            ]
        },
        {
            "name": "search_by_keyword",
            "description": { "zh": "Search scholarly articles by keyword.", "en": "Search scholarly articles by keyword." },
            "parameters": [
                {
                    "name": "query",
                    "description": { "zh": "Search query keyword(s)", "en": "Search query keyword(s)" },
                    "type": "string",
                    "required": true
                },
                {
                    "name": "rows",
                    "description": { "zh": "Number of results to return (default: 10, max: 100)", "en": "Number of results to return (default: 10, max: 100)" },
                    "type": "number",
                    "required": false
                },
                {
                    "name": "sort",
                    "description": { "zh": "Sort mode. Options: 'relevance', 'score', 'updated', 'deposited', 'indexed', 'published'.", "en": "Sort mode. Options: 'relevance', 'score', 'updated', 'deposited', 'indexed', 'published'." },
                    "type": "string",
                    "required": false
                },
                {
                    "name": "order",
                    "description": { "zh": "Sort order: 'asc' or 'desc' (default: 'desc').", "en": "Sort order: 'asc' or 'desc' (default: 'desc')." },
                    "type": "string",
                    "required": false
                }
            ]
        },
        {
            "name": "search_by_author",
            "description": { "zh": "Search articles by author name.", "en": "Search articles by author name." },
            "parameters": [
                {
                    "name": "author",
                    "description": { "zh": "Author name", "en": "Author name" },
                    "type": "string",
                    "required": true
                },
                {
                    "name": "rows",
                    "description": { "zh": "Number of results to return (default: 10, max: 100)", "en": "Number of results to return (default: 10, max: 100)" },
                    "type": "number",
                    "required": false
                }
            ]
        },
        {
            "name": "search_by_title",
            "description": { "zh": "Search articles by title.", "en": "Search articles by title." },
            "parameters": [
                {
                    "name": "title",
                    "description": { "zh": "Article title or title keyword(s)", "en": "Article title or title keyword(s)" },
                    "type": "string",
                    "required": true
                },
                {
                    "name": "rows",
                    "description": { "zh": "Number of results to return (default: 10, max: 100)", "en": "Number of results to return (default: 10, max: 100)" },
                    "type": "number",
                    "required": false
                }
            ]
        },
        {
            "name": "search_by_issn",
            "description": { "zh": "Search articles published in a journal by ISSN.", "en": "Search articles published in a journal by ISSN." },
            "parameters": [
                {
                    "name": "issn",
                    "description": { "zh": "Journal ISSN identifier, e.g. '1476-4687'", "en": "Journal ISSN identifier, e.g. '1476-4687'" },
                    "type": "string",
                    "required": true
                },
                {
                    "name": "rows",
                    "description": { "zh": "Number of results to return (default: 10, max: 100)", "en": "Number of results to return (default: 10, max: 100)" },
                    "type": "number",
                    "required": false
                }
            ]
        }
    ]
}*/
const CrossrefSearch = (function () {
    const BASE_URL = "https://api.crossref.org";
    const DEFAULT_ROWS = 10;
    const MAX_ROWS = 100;

    function buildQueryString(params: Record<string, string>): string {
        return Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
    }

    type SearchByDoiParams = {
        doi: string;
    };

    type SearchByKeywordParams = {
        query: string;
        rows?: number;
        sort?: string;
        order?: string;
    };

    type SearchByAuthorParams = {
        author: string;
        rows?: number;
    };

    type SearchByTitleParams = {
        title: string;
        rows?: number;
    };

    type SearchByISSNParams = {
        issn: string;
        rows?: number;
    };

    /**
     * Format author information
     */
    function formatAuthors(authors: any[]): string {
        if (!authors || authors.length === 0) return "N/A";
        return authors
            .slice(0, 5) // show only the first 5 authors
            .map((author: any) => {
                const given = author.given || "";
                const family = author.family || "";
                return `${given} ${family}`.trim();
            })
            .filter(name => name.length > 0)
            .join(", ");
    }

    /**
     * Format a date
     */
    function formatDate(dateParts: number[][]): string {
        if (!dateParts || dateParts.length === 0 || !dateParts[0]) return "N/A";
        const parts = dateParts[0];
        if (parts.length === 1) return `${parts[0]}`;
        if (parts.length === 2) return `${parts[0]}-${String(parts[1]).padStart(2, '0')}`;
        if (parts.length === 3) return `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
        return "N/A";
    }

    /**
     * Format the information of a single article
     */
    function formatArticle(item: any, index?: number): string {
        const lines: string[] = [];

        if (index !== undefined) {
            lines.push(`\n=== Article ${index + 1} ===`);
        }

        // Title
        const title = item.title && item.title.length > 0 ? item.title[0] : "No Title";
        lines.push(`Title: ${title}`);

        // DOI
        if (item.DOI) {
            lines.push(`DOI: ${item.DOI}`);
            lines.push(`URL: https://doi.org/${item.DOI}`);
        }

        // Authors
        const authors = formatAuthors(item.author);
        lines.push(`Authors: ${authors}`);

        // Publication date
        const publishedDate = formatDate(item.published?.['date-parts'] || item['published-print']?.['date-parts'] || item['published-online']?.['date-parts']);
        lines.push(`Published: ${publishedDate}`);

        // Journal/conference
        if (item['container-title'] && item['container-title'].length > 0) {
            lines.push(`Journal/Conference: ${item['container-title'][0]}`);
        }

        // ISSN
        if (item.ISSN && item.ISSN.length > 0) {
            lines.push(`ISSN: ${item.ISSN.join(', ')}`);
        }

        // Publisher
        if (item.publisher) {
            lines.push(`Publisher: ${item.publisher}`);
        }

        // Type
        if (item.type) {
            lines.push(`Type: ${item.type}`);
        }

        // Citation count
        if (item['is-referenced-by-count'] !== undefined) {
            lines.push(`Citations: ${item['is-referenced-by-count']}`);
        }

        // Abstract (if available)
        if (item.abstract) {
            // Remove HTML tags
            const abstractText = item.abstract.replace(/<[^>]*>/g, '');
            lines.push(`Abstract: ${abstractText.substring(0, 500)}${abstractText.length > 500 ? '...' : ''}`);
        }

        return lines.join('\n');
    }

    /**
     * Query an article by DOI
     */
    async function searchByDoi(params: SearchByDoiParams): Promise<any> {
        const { doi } = params;

        if (!doi || doi.trim() === "") {
            return {
                success: false,
                message: "Please provide a valid DOI"
            };
        }

        try {
            const url = `${BASE_URL}/works/${encodeURIComponent(doi)}`;
            const client = OkHttp.newClient();
            const response = await client.get(url, {
                'User-Agent': 'Operit/1.0 (mailto:support@example.com)'
            });

            if (!response.isSuccessful()) {
                return {
                    success: false,
                    message: `Query failed: HTTP ${response.statusCode} - ${response.statusMessage}`
                };
            }

            const data = response.json();

            if (data.status === "ok" && data.message) {
                const article = formatArticle(data.message);
                return {
                    success: true,
                    message: "Query succeeded",
                    data: article
                };
            } else {
                return {
                    success: false,
                    message: "No article found for this DOI"
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Query failed: ${error.message}`
            };
        }
    }

    /**
     * Search articles by keyword
     */
    async function searchByKeyword(params: SearchByKeywordParams): Promise<any> {
        const { query, rows = DEFAULT_ROWS, sort = "relevance", order = "desc" } = params;

        if (!query || query.trim() === "") {
            return {
                success: false,
                message: "Please provide valid search keywords"
            };
        }

        const actualRows = Math.min(Math.max(rows, 1), MAX_ROWS);

        try {
            const queryString = buildQueryString({
                query: query,
                rows: String(actualRows),
                sort: sort,
                order: order
            });

            const url = `${BASE_URL}/works?${queryString}`;
            const client = OkHttp.newClient();
            const response = await client.get(url, {
                'User-Agent': 'Operit/1.0 (mailto:support@example.com)'
            });

            if (!response.isSuccessful()) {
                return {
                    success: false,
                    message: `Search failed: HTTP ${response.statusCode} - ${response.statusMessage}`
                };
            }

            const data = response.json();

            if (data.status === "ok" && data.message && data.message.items) {
                const items = data.message.items;
                const totalResults = data.message['total-results'];

                const results = items.map((item: any, index: number) => formatArticle(item, index));

                const summary = `Found ${totalResults} results (showing ${items.length}):\n${results.join('\n\n')}`;

                return {
                    success: true,
                    message: "Search succeeded",
                    data: summary,
                    total: totalResults,
                    count: items.length
                };
            } else {
                return {
                    success: false,
                    message: "No matching articles found"
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Search failed: ${error.message}`
            };
        }
    }

    /**
     * Search articles by author
     */
    async function searchByAuthor(params: SearchByAuthorParams): Promise<any> {
        const { author, rows = DEFAULT_ROWS } = params;

        if (!author || author.trim() === "") {
            return {
                success: false,
                message: "Please provide a valid author name"
            };
        }

        const actualRows = Math.min(Math.max(rows, 1), MAX_ROWS);

        try {
            const queryString = buildQueryString({
                'query.author': author,
                rows: String(actualRows)
            });

            const url = `${BASE_URL}/works?${queryString}`;
            const client = OkHttp.newClient();
            const response = await client.get(url, {
                'User-Agent': 'Operit/1.0 (mailto:support@example.com)'
            });

            if (!response.isSuccessful()) {
                return {
                    success: false,
                    message: `Search failed: HTTP ${response.statusCode} - ${response.statusMessage}`
                };
            }

            const data = response.json();

            if (data.status === "ok" && data.message && data.message.items) {
                const items = data.message.items;
                const totalResults = data.message['total-results'];

                const results = items.map((item: any, index: number) => formatArticle(item, index));

                const summary = `Found ${totalResults} results for author "${author}" (showing ${items.length}):\n${results.join('\n\n')}`;

                return {
                    success: true,
                    message: "Search succeeded",
                    data: summary,
                    total: totalResults,
                    count: items.length
                };
            } else {
                return {
                    success: false,
                    message: `No articles found for author "${author}"`
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Search failed: ${error.message}`
            };
        }
    }

    /**
     * Search articles by title
     */
    async function searchByTitle(params: SearchByTitleParams): Promise<any> {
        const { title, rows = DEFAULT_ROWS } = params;

        if (!title || title.trim() === "") {
            return {
                success: false,
                message: "Please provide a valid article title"
            };
        }

        const actualRows = Math.min(Math.max(rows, 1), MAX_ROWS);

        try {
            const queryString = buildQueryString({
                'query.title': title,
                rows: String(actualRows)
            });

            const url = `${BASE_URL}/works?${queryString}`;
            const client = OkHttp.newClient();
            const response = await client.get(url, {
                'User-Agent': 'Operit/1.0 (mailto:support@example.com)'
            });


            const data = response.json();

            if (data.status === "ok" && data.message && data.message.items) {
                const items = data.message.items;
                const totalResults = data.message['total-results'];

                const results = items.map((item: any, index: number) => formatArticle(item, index));

                const summary = `Found ${totalResults} results matching title "${title}" (showing ${items.length}):\n${results.join('\n\n')}`;

                return {
                    success: true,
                    message: "Search succeeded",
                    data: summary,
                    total: totalResults,
                    count: items.length
                };
            } else {
                return {
                    success: false,
                    message: `No articles found with title containing "${title}"`
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Search failed: ${error.message}`
            };
        }
    }

    /**
     * Query journal articles by ISSN
     */
    async function searchByISSN(params: SearchByISSNParams): Promise<any> {
        const { issn, rows = DEFAULT_ROWS } = params;

        if (!issn || issn.trim() === "") {
            return {
                success: false,
                message: "Please provide a valid ISSN"
            };
        }

        const actualRows = Math.min(Math.max(rows, 1), MAX_ROWS);

        try {
            const url = `${BASE_URL}/journals/${encodeURIComponent(issn)}/works?rows=${actualRows}`;
            const client = OkHttp.newClient();
            const response = await client.get(url, {
                'User-Agent': 'Operit/1.0 (mailto:support@example.com)'
            });

            if (!response.isSuccessful()) {
                return {
                    success: false,
                    message: `Query failed: HTTP ${response.statusCode} - ${response.statusMessage}`
                };
            }

            const data = response.json();

            if (data.status === "ok" && data.message && data.message.items) {
                const items = data.message.items;
                const totalResults = data.message['total-results'];

                const results = items.map((item: any, index: number) => formatArticle(item, index));

                const summary = `Found ${totalResults} articles from journal ISSN ${issn} (showing ${items.length}):\n${results.join('\n\n')}`;

                return {
                    success: true,
                    message: "Query succeeded",
                    data: summary,
                    total: totalResults,
                    count: items.length
                };
            } else {
                return {
                    success: false,
                    message: `No articles found for the journal with ISSN "${issn}"`
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Query failed: ${error.message}`
            };
        }
    }

    /**
     * Wrapper function for unified error handling
     */
    async function wrapToolExecution(func: (params: any) => Promise<any>, params: any) {
        try {
            const result = await func(params);
            complete(result);
        } catch (error: any) {
            console.error(`Tool execution failed`, error);
            complete({
                success: false,
                message: `Unexpected error while executing tool: ${error.message}`,
            });
        }
    }

    /**
     * Test function
     */
    async function main() {
        console.log("=== Crossref API Test ===\n");

        // Test 1: query by DOI
        console.log("1. Testing query by DOI...");
        const doiResult = await searchByDoi({ doi: "10.1038/nature12373" });
        console.log(JSON.stringify(doiResult, null, 2));
        console.log("\n");

        // Test 2: search by keyword
        console.log("2. Testing search by keyword...");
        const keywordResult = await searchByKeyword({ query: "machine learning", rows: 3 });
        console.log(JSON.stringify(keywordResult, null, 2));
        console.log("\n");

        // Test 3: search by author
        console.log("3. Testing search by author...");
        const authorResult = await searchByAuthor({ author: "John Smith", rows: 3 });
        console.log(JSON.stringify(authorResult, null, 2));
        console.log("\n");

        // Test 4: search by title
        console.log("4. Testing search by title...");
        const titleResult = await searchByTitle({ title: "neural networks", rows: 3 });
        console.log(JSON.stringify(titleResult, null, 2));
        console.log("\n");

        console.log("=== Tests completed ===");
    }

    return {
        search_by_doi: (params: any) => wrapToolExecution(searchByDoi, params),
        search_by_keyword: (params: any) => wrapToolExecution(searchByKeyword, params),
        search_by_author: (params: any) => wrapToolExecution(searchByAuthor, params),
        search_by_title: (params: any) => wrapToolExecution(searchByTitle, params),
        search_by_issn: (params: any) => wrapToolExecution(searchByISSN, params),
        main,
    };
})();

// Export tool functions
exports.search_by_doi = CrossrefSearch.search_by_doi;
exports.search_by_keyword = CrossrefSearch.search_by_keyword;
exports.search_by_author = CrossrefSearch.search_by_author;
exports.search_by_title = CrossrefSearch.search_by_title;
exports.search_by_issn = CrossrefSearch.search_by_issn;
exports.main = CrossrefSearch.main;
