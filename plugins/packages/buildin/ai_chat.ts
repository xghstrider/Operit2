/* METADATA
{
  "name": "ai_chat",

  "display_name": {
      "zh": "AI-to-AI Conversation",
      "en": "AI-to-AI Chat"
  },
  "description": {
    "zh": "Calls AI model APIs to enable intelligent conversation between AIs.",
    "en": "Call an AI model API to enable interactive conversations between AIs."
  },
  "env": ["AI_API_BASE_URL", "AI_API_KEY", "AI_MODEL_NAME"],
  "category": "Chat",
  "tools": [{
    "name": "chat_completion",
    "description": {
      "zh": "Sends a message to an AI model and gets the reply. Supports timeout protection (default 30 seconds). Prohibits bulleted list output at the source.",
      "en": "Send messages to an AI model and get responses. Includes timeout protection (default: 30s). Enforces non-bulleted output from the source."
    },
    "parameters": [
      {"name": "messages", "description": {"zh": "Message array or a string", "en": "Message array or a string"}, "type": "any", "required": true},
      {"name": "system_prompt", "description": {"zh": "System prompt (the system will automatically append non-bulleted instructions)", "en": "System prompt (the system will automatically append non-bulleted instructions)"}, "type": "string", "required": false},
      {"name": "temperature", "description": {"zh": "Temperature (0.0-2.0)", "en": "Temperature (0.0-2.0)"}, "type": "number", "required": false, "default": 0.7},
      {"name": "max_tokens", "description": {"zh": "Maximum generation length", "en": "Maximum generation length"}, "type": "number", "required": false},
      {"name": "timeout", "description": {"zh": "Timeout (milliseconds)", "en": "Timeout (milliseconds)"}, "type": "number", "required": false, "default": 30000}
    ]
  }]
 } */


const aiModelInteraction = (function () {
    type ChatRole = 'system' | 'user' | 'assistant' | 'function';

    type ChatMessage = {
        role: ChatRole;
        content: string;
        name?: string;
        function_call?: {
            name: string;
            arguments?: string;
        };
    };

    type ChatCompletionToolParams = {
        messages: ChatMessage[] | string;
        message?: string;
        system_prompt?: string;
        temperature?: number;
        max_tokens?: number;
        timeout?: number;
        functions?: any[];
    };

    type UniversalHttpResponse = {
        status: number;
        statusText: string;
        headers?: Record<string, string>;
        body: any;
    };

    async function universalHttpRequest(
        url: string,
        method: string = 'POST',
        headers: Record<string, string> = {},
        body: any = null,
        responseType: 'json' | 'text' = 'json',
        timeout: number = 30000
    ): Promise<UniversalHttpResponse> {
        const timeoutPromise: Promise<never> = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Request timed out: ${timeout}ms`)), timeout)
        );

        const requestPromise: Promise<UniversalHttpResponse> = (async () => {
            if (typeof OkHttp === 'undefined') {
                throw new Error('OkHttp is not available');
            }

            const client = OkHttp.newBuilder()
                .connectTimeout(timeout)
                .readTimeout(timeout)
                .writeTimeout(timeout)
                .build();

            const requestBuilder = client.newRequest()
                .url(url)
                .method(method.toUpperCase());

            if (headers && Object.keys(headers).length > 0) {
                requestBuilder.headers(headers);
            }

            const upperMethod = method.toUpperCase();
            if (body !== null && body !== undefined && upperMethod !== 'GET' && upperMethod !== 'HEAD') {
                if (typeof body === 'string') {
                    requestBuilder.body(body, 'text');
                } else {
                    requestBuilder.body(body, 'json');
                }
            }

            const response: OkHttpResponse = await requestBuilder.build().execute();
            const resultBody = responseType === 'json' ? response.json() : response.content;
            return {
                status: response.statusCode,
                statusText: response.statusMessage || '',
                headers: response.headers,
                body: resultBody,
            };
        })();

        return Promise.race([requestPromise, timeoutPromise]);
    }

    function cleanText(text: unknown): string {
        if (!text || typeof text !== 'string') return String(text ?? '');

        let cleaned: string = text;

        // Handle escapes and entities
        cleaned = cleaned.replace(/\|["\\]?n/g, '\n');
        cleaned = cleaned.replace(/\\\\([\\nrt"'&])/g, (m, c) => ({ n: '\n', r: '\r', t: '\t', '"': '"', "'": "'", "&": "&" }[c] || m));
        cleaned = cleaned.replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

        // Replace HTML entities in one pass
        const entities = { quot: '"', amp: '&', lt: '<', gt: '>', nbsp: ' ', '#39': "'", apos: "'" };
        cleaned = cleaned.replace(/&(\w+|#\d+);/g, (m, e) => entities[e] || m);

        // Clean up code blocks
        cleaned = cleaned.replace(/```[\w-]*\s*\n([\s\S]*?)```/g, '$1').replace(/```/g, '').replace(/`([^`]+)`/g, '$1');

        // Normalize whitespace and bullet points
        cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
        cleaned = cleaned.split('\n').map(l => l.replace(/^[\s\uFEFF\xA0\u3000\u200B-\u200D]+/g, '')).join('\n');
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
        cleaned = cleaned.replace(/^\s*[-•●]\s+|^\s*\d+\.\s+|^\s*\d+\)\s+|^\s*\([a-zA-Z]\)\s+/gm, '');

        return cleaned || text;
    }

    function getConfig(varName: string, defaultValue: string | null = null): string {
        try {
            const value = getEnv(varName);
            if (!value || value === `YOUR_${varName}`) {
                if (defaultValue !== null) return defaultValue;
                throw new Error(`${varName} is not configured`);
            }
            return value.trim();
        } catch (e) {
            if (defaultValue !== null) return defaultValue;
            throw new Error(`${varName} is not configured`);
        }
    }

    function getFullConfig() {
        try {
            return {
                apiBaseUrl: getConfig('AI_API_BASE_URL', ''),
                apiKey: getConfig('AI_API_KEY', ''),
                modelName: getConfig('AI_MODEL_NAME', ''),
                timeout: 30000
            };
        } catch {
            return { apiBaseUrl: '', apiKey: '', modelName: '', timeout: 30000 };
        }
    }

    function joinUrl(baseUrl: string, path: string): string {
        const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
        return `${normalizedBase}${normalizedPath}`;
    }

    async function tryEndpoints(baseUrl: string, payload: Record<string, any>, config: { apiKey: string }, timeout: number): Promise<UniversalHttpResponse> {
        if (baseUrl.includes('chat/completions')) {
            return await universalHttpRequest(
                baseUrl,
                'POST',
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                payload,
                'json',
                timeout
            );
        }

        const endpoints = ['v1/chat/completions', 'chat/completions'];
        let lastError;

        for (const endpoint of endpoints) {
            try {
                const url = joinUrl(baseUrl, endpoint);
                const response = await universalHttpRequest(
                    url,
                    'POST',
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.apiKey}`
                    },
                    payload,
                    'json',
                    timeout
                );
                if (response.status === 200) return response;
                lastError = new Error(`Endpoint ${endpoint} returned ${response.status}`);
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('All endpoint attempts failed');
    }

    async function chat_completion_logic(rawInput: ChatCompletionToolParams | string, timeout: number) {
        if (rawInput === null || rawInput === undefined) {
            throw new Error('Invalid argument: input parameters cannot be empty');
        }

        const internalParams: {
            messages: ChatMessage[];
            system_prompt?: string;
            temperature: number;
            max_tokens?: number;
            functions?: any[];
        } = {
            messages: [],
            system_prompt: undefined,
            temperature: 0.7,
            max_tokens: undefined,
            functions: undefined,
        };

        // Process input arguments
        if (typeof rawInput === 'string') {
            internalParams.messages = [{ role: 'user', content: rawInput }];
        } else if (typeof rawInput === 'object') {
            const hasMessageField = 'message' in rawInput;
            const hasMessagesField = 'messages' in rawInput;

            if (hasMessagesField) {
                const messagesValue = (rawInput as ChatCompletionToolParams).messages;
                if (Array.isArray(messagesValue)) {
                    internalParams.messages = messagesValue as ChatMessage[];
                } else if (typeof messagesValue === 'string') {
                    internalParams.messages = [{ role: 'user', content: messagesValue }];
                } else {
                    throw new Error(`'messages' must be an array or a string`);
                }
            } else if (hasMessageField) {
                const messageValue = (rawInput as ChatCompletionToolParams).message;
                if (typeof messageValue !== 'string') {
                    throw new Error(`'message' must be a string`);
                }
                internalParams.messages = [{ role: 'user', content: messageValue }];
            } else {
                throw new Error(`Object must contain a 'message' or 'messages' field`);
            }

            internalParams.system_prompt = (rawInput as ChatCompletionToolParams).system_prompt ? String((rawInput as ChatCompletionToolParams).system_prompt) : undefined;
            internalParams.temperature = (rawInput as ChatCompletionToolParams).temperature !== undefined ? Number((rawInput as ChatCompletionToolParams).temperature) : 0.7;
            if (isNaN(internalParams.temperature)) internalParams.temperature = 0.7;

            internalParams.max_tokens = (rawInput as ChatCompletionToolParams).max_tokens !== undefined ? Number((rawInput as ChatCompletionToolParams).max_tokens) : undefined;
            if (internalParams.max_tokens !== undefined && isNaN(internalParams.max_tokens)) {
                internalParams.max_tokens = undefined;
            }

            internalParams.functions = Array.isArray((rawInput as ChatCompletionToolParams).functions) ? (rawInput as ChatCompletionToolParams).functions : undefined;
        } else {
            throw new Error(`Unsupported argument type '${typeof rawInput}'`);
        }

        // Validate messages
        if (!Array.isArray(internalParams.messages) || internalParams.messages.length === 0) {
            throw new Error('messages must be a valid non-empty array');
        }

        internalParams.messages.forEach((msg, idx) => {
            if (!msg || typeof msg !== 'object' || !msg.role || typeof msg.content !== 'string') {
                throw new Error(`Message #${idx} has an invalid format`);
            }
        });

        // Get configuration
        const config = getFullConfig();
        if (!config.apiBaseUrl || !config.apiKey) {
            throw new Error('AI_API_BASE_URL and AI_API_KEY must be configured');
        }

        // Build the message array
        const antiListInstruction = "[IMPORTANT INSTRUCTION] You must answer in continuous paragraphs; any bullet points, lists, numbering, or bullet formatting are strictly forbidden.";
        const finalMessages = [
            {
                role: 'system',
                content: internalParams.system_prompt
                    ? internalParams.system_prompt + "\n\n" + antiListInstruction
                    : antiListInstruction
            },
            ...internalParams.messages
        ];

        // Build the request
        const payload: Record<string, any> = {
            model: String(config.modelName || 'gpt-3.5-turbo'),
            messages: finalMessages,
            temperature: Number(internalParams.temperature)
        };

        if (internalParams.max_tokens !== undefined && !isNaN(internalParams.max_tokens)) {
            payload.max_tokens = Number(internalParams.max_tokens);
        }
        if (internalParams.functions) payload.functions = internalParams.functions;

        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        // Send the request
        let response;
        try {
            response = await tryEndpoints(config.apiBaseUrl, payload, config, timeout);
        } catch {
            response = await universalHttpRequest(
                config.apiBaseUrl,
                'POST',
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                payload,
                'json',
                timeout
            );
        }

        if (response.status !== 200) {
            let errorMsg = `API request failed: ${response.status}`;
            try {
                const errorData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
                errorMsg += ` - ${errorData.error?.message || JSON.stringify(errorData)}`;
            } catch {
                errorMsg += ` - ${response.statusText}`;
            }
            throw new Error(errorMsg);
        }

        const result = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
        if (!result.choices?.[0]) {
            throw new Error('Unexpected API response format');
        }

        const choice = result.choices[0];
        const reply: any = {
            message: choice.message,
            finish_reason: choice.finish_reason,
            usage: result.usage || null,
            model: result.model || config.modelName,
            id: result.id,
            created: result.created
        };

        if (choice.message.function_call) {
            reply.is_function_call = true;
            reply.function_name = choice.message.function_call.name;
            reply.function_arguments = JSON.parse(choice.message.function_call.arguments || '{}');
        }

        return reply;
    }

    async function chat_completion_impl(params: ChatCompletionToolParams | string) {
        const normalizedParams: ChatCompletionToolParams = typeof params === 'object'
            ? (params as ChatCompletionToolParams)
            : { messages: String(params) };

        const timeout = normalizedParams.timeout || 30000;

        const result = await Promise.race([
            chat_completion_logic(normalizedParams, timeout),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error(`Operation timed out: ${timeout}ms`)), timeout)
            )
        ]);

        const rawReply = result.message?.content;
        const cleanedReply = cleanText(rawReply);

        return {
            success: true,
            message: "AI reply retrieved successfully!",
            data: result,
            reply: cleanedReply,
            raw_reply: rawReply,
            usage: result.usage,
            anti_list_applied: true
        };
    }

    async function wrapToolExecution<T>(func: (params: any) => Promise<T>, params?: any) {
        try {
            const result = await func(params || {});
            complete(result);
        } catch (error: any) {
            console.error(`Tool ${func.name} failed unexpectedly`, error);
            complete({
                success: false,
                message: `AI conversation failed: ${String(error && error.message ? error.message : error)}`,
                error_stack: error && error.stack
            });
        }
    }

    async function chat_completion(params?: ChatCompletionToolParams | string) {
        return await wrapToolExecution(chat_completion_impl, params);
    }

    async function main(params?: { message?: string; temperature?: number; timeout?: number }) {
        const config = getFullConfig();
        if (!config.apiBaseUrl || !config.apiKey) {
            return {
                success: false,
                message: 'AI_API_BASE_URL and AI_API_KEY must be configured',
                config
            };
        }

        return await chat_completion_impl({
            messages: params?.message || 'Hello! Please respond in a continuous paragraph without any list or bullet points.',
            temperature: params?.temperature ?? 0.2,
            timeout: params?.timeout ?? 15000,
        });
    }

    return {
        chat_completion,
        single_message: chat_completion,
        test_connection: async (params?: { timeout?: number }) => wrapToolExecution(
            async () => await chat_completion_impl({
                messages: "Hello! Please respond in a continuous paragraph without any list or bullet points.",
                temperature: 0.1,
                timeout: params?.timeout ?? 10000
            }),
            {}
        ),
        main: (params?: { message?: string; temperature?: number; timeout?: number }) => wrapToolExecution(main, params),
        getConfig: getFullConfig,
        _makeHttpRequest: universalHttpRequest,
        _cleanText: cleanText
    };
})();

// Export tool functions (CommonJS)
exports.chat_completion = aiModelInteraction.chat_completion;
exports.single_message = aiModelInteraction.single_message;
exports.test_connection = aiModelInteraction.test_connection;
exports.getConfig = aiModelInteraction.getConfig;
exports.main = aiModelInteraction.main;
