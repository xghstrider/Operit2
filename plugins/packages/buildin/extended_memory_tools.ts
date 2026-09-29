/* METADATA
{
    "name": "extended_memory_tools",

    "display_name": {
        "zh": "Extended Memory Tools",
        "en": "Extended Memory Tools"
    },
    "description": {
        "zh": "Extended memory toolkit: provides creating, updating, deleting, and moving memories, linking memories, and updating USER.md.",
        "en": "Extended memory tools: create, update, delete, move, link memories, and update USER.md."
    },
    "category": "Memory",
    "enabledByDefault": true,
    "tools": [
        {
            "name": "create_memory",
            "description": { "zh": "Create a new memory node.", "en": "Create a new memory node." },
            "parameters": [
                { "name": "title", "description": { "zh": "Memory title", "en": "Memory title" }, "type": "string", "required": true },
                { "name": "content", "description": { "zh": "Memory content", "en": "Memory content" }, "type": "string", "required": true },
                { "name": "content_type", "description": { "zh": "Optional: content type (default: text/plain)", "en": "Optional: content type (default: text/plain)" }, "type": "string", "required": false },
                { "name": "source", "description": { "zh": "Optional: source (default: ai_created)", "en": "Optional: source (default: ai_created)" }, "type": "string", "required": false },
                { "name": "folder_path", "description": { "zh": "Optional: folder path (default: empty)", "en": "Optional: folder path (default: empty)" }, "type": "string", "required": false },
                { "name": "tags", "description": { "zh": "Optional: tags (comma-separated string)", "en": "Optional: tags (comma-separated string)" }, "type": "string", "required": false }
            ]
        },
        {
            "name": "update_memory",
            "description": { "zh": "Update an existing memory node by title.", "en": "Update an existing memory node by title." },
            "parameters": [
                { "name": "old_title", "description": { "zh": "Old title (to locate the memory)", "en": "Old title (to locate the memory)" }, "type": "string", "required": true },
                { "name": "new_title", "description": { "zh": "Optional: new title (rename)", "en": "Optional: new title (rename)" }, "type": "string", "required": false },
                { "name": "content", "description": { "zh": "Optional: new content", "en": "Optional: new content" }, "type": "string", "required": false },
                { "name": "content_type", "description": { "zh": "Optional: content type", "en": "Optional: content type" }, "type": "string", "required": false },
                { "name": "source", "description": { "zh": "Optional: source", "en": "Optional: source" }, "type": "string", "required": false },
                { "name": "credibility", "description": { "zh": "Optional: credibility 0-1", "en": "Optional: credibility 0-1" }, "type": "number", "required": false },
                { "name": "importance", "description": { "zh": "Optional: importance 0-1", "en": "Optional: importance 0-1" }, "type": "number", "required": false },
                { "name": "folder_path", "description": { "zh": "Optional: folder path", "en": "Optional: folder path" }, "type": "string", "required": false },
                { "name": "tags", "description": { "zh": "Optional: tags (comma-separated string)", "en": "Optional: tags (comma-separated string)" }, "type": "string", "required": false }
            ]
        },
        {
            "name": "delete_memory",
            "description": { "zh": "Delete a memory node by title (irreversible).", "en": "Delete a memory node by title (irreversible)." },
            "parameters": [
                { "name": "title", "description": { "zh": "Memory title to delete", "en": "Memory title to delete" }, "type": "string", "required": true }
            ]
        },
        {
            "name": "move_memory",
            "description": { "zh": "Move memories to another folder in batch. Filter by titles and source folder.", "en": "Move memories to another folder in batch. Filter by titles and source folder." },
            "parameters": [
                { "name": "target_folder_path", "description": { "zh": "Target folder path (empty string means uncategorized)", "en": "Target folder path (empty string means uncategorized)" }, "type": "string", "required": true },
                { "name": "titles", "description": { "zh": "Optional: title list (comma/newline separated)", "en": "Optional: title list (comma/newline separated)" }, "type": "string", "required": false },
                { "name": "source_folder_path", "description": { "zh": "Optional: source folder path (empty string means uncategorized)", "en": "Optional: source folder path (empty string means uncategorized)" }, "type": "string", "required": false }
            ]
        },
        {
            "name": "link_memories",
            "description": { "zh": "Create a semantic link between two memories.", "en": "Create a semantic link between two memories." },
            "parameters": [
                { "name": "source_title", "description": { "zh": "Source memory title", "en": "Source memory title" }, "type": "string", "required": true },
                { "name": "target_title", "description": { "zh": "Target memory title", "en": "Target memory title" }, "type": "string", "required": true },
                { "name": "link_type", "description": { "zh": "Optional: link type (default: related)", "en": "Optional: link type (default: related)" }, "type": "string", "required": false },
                { "name": "weight", "description": { "zh": "Optional: weight 0-1 (default: 0.7)", "en": "Optional: weight 0-1 (default: 0.7)" }, "type": "number", "required": false },
                { "name": "description", "description": { "zh": "Optional: relationship description", "en": "Optional: relationship description" }, "type": "string", "required": false }
            ]
        },
        {
            "name": "query_memory_links",
            "description": { "zh": "Query memory links (filter by id, source, target, or type).", "en": "Query memory links (filter by id, source, target, or type)." },
            "parameters": [
                { "name": "link_id", "description": { "zh": "Optional: link id", "en": "Optional: link id" }, "type": "number", "required": false },
                { "name": "source_title", "description": { "zh": "Optional: source memory title", "en": "Optional: source memory title" }, "type": "string", "required": false },
                { "name": "target_title", "description": { "zh": "Optional: target memory title", "en": "Optional: target memory title" }, "type": "string", "required": false },
                { "name": "link_type", "description": { "zh": "Optional: relation type", "en": "Optional: relation type" }, "type": "string", "required": false },
                { "name": "limit", "description": { "zh": "Optional: limit 1-200, default 20", "en": "Optional: limit 1-200, default 20" }, "type": "number", "required": false }
            ]
        },
        {
            "name": "update_memory_link",
            "description": { "zh": "Update a memory link (by link_id or source/target/link_type).", "en": "Update a memory link (by link_id or source/target/link_type)." },
            "parameters": [
                { "name": "link_id", "description": { "zh": "Optional: link ID", "en": "Optional: link ID" }, "type": "number", "required": false },
                { "name": "source_title", "description": { "zh": "Optional: source title (used when link_id is not provided)", "en": "Optional: source title (used when link_id is not provided)" }, "type": "string", "required": false },
                { "name": "target_title", "description": { "zh": "Optional: target title (used when link_id is not provided)", "en": "Optional: target title (used when link_id is not provided)" }, "type": "string", "required": false },
                { "name": "link_type", "description": { "zh": "Optional: current relation type (for unique resolution)", "en": "Optional: current relation type (for unique resolution)" }, "type": "string", "required": false },
                { "name": "new_link_type", "description": { "zh": "Optional: new relation type", "en": "Optional: new relation type" }, "type": "string", "required": false },
                { "name": "weight", "description": { "zh": "Optional: new weight 0-1", "en": "Optional: new weight 0-1" }, "type": "number", "required": false },
                { "name": "description", "description": { "zh": "Optional: new relationship description", "en": "Optional: new relationship description" }, "type": "string", "required": false }
            ]
        },
        {
            "name": "delete_memory_link",
            "description": { "zh": "Delete a memory link (by link_id or source/target/link_type).", "en": "Delete a memory link (by link_id or source/target/link_type)." },
            "parameters": [
                { "name": "link_id", "description": { "zh": "Optional: link ID", "en": "Optional: link ID" }, "type": "number", "required": false },
                { "name": "source_title", "description": { "zh": "Optional: source title (used when link_id is not provided)", "en": "Optional: source title (used when link_id is not provided)" }, "type": "string", "required": false },
                { "name": "target_title", "description": { "zh": "Optional: target title (used when link_id is not provided)", "en": "Optional: target title (used when link_id is not provided)" }, "type": "string", "required": false },
                { "name": "link_type", "description": { "zh": "Optional: relation type (for unique resolution)", "en": "Optional: relation type (for unique resolution)" }, "type": "string", "required": false }
            ]
        },
        {
            "name": "update_user_preferences",
            "description": { "zh": "Overwrite USER.md for the current character\u0027s bound memory store.", "en": "Overwrite USER.md for the current character\u0027s bound memory store." },
            "parameters": [
                { "name": "content", "description": { "zh": "New USER.md content", "en": "New USER.md content" }, "type": "string", "required": true }
            ]
        }
    ]
}*/

const ExtendedMemoryTools = (function () {
    interface ToolResponse<T = unknown> {
        success: boolean;
        message: string;
        data?: T;
    }

    type CreateMemoryParams = {
        title: string;
        content: string;
        content_type?: string;
        source?: string;
        folder_path?: string;
        tags?: string;
    };

    type UpdateMemoryParams = {
        old_title: string;
        new_title?: string;
        content?: string;
        content_type?: string;
        source?: string;
        credibility?: number;
        importance?: number;
        folder_path?: string;
        tags?: string;
    };

    type DeleteMemoryParams = {
        title: string;
    };

    type MoveMemoryParams = {
        target_folder_path: string;
        titles?: string;
        source_folder_path?: string;
    };

    type LinkMemoriesParams = {
        source_title: string;
        target_title: string;
        link_type?: string;
        weight?: number;
        description?: string;
    };

    type QueryMemoryLinksParams = {
        link_id?: number;
        source_title?: string;
        target_title?: string;
        link_type?: string;
        limit?: number;
    };

    type UpdateMemoryLinkParams = QueryMemoryLinksParams & {
        new_link_type?: string;
        weight?: number;
        description?: string;
    };

    type DeleteMemoryLinkParams = QueryMemoryLinksParams;

    type UpdateUserPreferencesParams = {
        content: string;
    };

    /** Resolves the active caller's registered memory binding for each tool invocation. */
    async function getBoundMemoryOwnerKey(): Promise<string> {
        const callerCardId = requireText(getCallerCardId(), 'caller_card_id');
        return Tools.Memory.getOwnerKey(callerCardId);
    }

    /** Validates a required text parameter. */
    function requireText(value: unknown, name: string): string {
        const text = String(value ?? '').trim();
        if (!text) {
            throw new Error(`Missing parameter: ${name}`);
        }
        return text;
    }

    /** Parses the supplied memory title list. */
    function parseTitles(value?: string): string[] | undefined {
        if (value === undefined) {
            return undefined;
        }
        const titles = value.split(/[,\n|]/).map((item) => item.trim()).filter((item) => item.length > 0);
        return titles.length > 0 ? titles : undefined;
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function create_memory_impl(params: CreateMemoryParams): Promise<ToolResponse<string>> {
        const result = await Tools.Memory.create({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            title: requireText(params?.title, 'title'),
            content: requireText(params?.content, 'content'),
            contentType: params.content_type,
            source: params.source,
            folderPath: params.folder_path,
            tags: params.tags,
        });
        return { success: typeof result === 'string' && result.length > 0, message: 'Memory created', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function update_memory_impl(params: UpdateMemoryParams): Promise<ToolResponse<string>> {
        const result = await Tools.Memory.update({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            oldTitle: requireText(params?.old_title, 'old_title'),
            newTitle: params.new_title,
            content: params.content,
            contentType: params.content_type,
            source: params.source,
            credibility: params.credibility,
            importance: params.importance,
            folderPath: params.folder_path,
            tags: params.tags,
        });
        return { success: typeof result === 'string' && result.length > 0, message: 'Memory updated', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function delete_memory_impl(params: DeleteMemoryParams): Promise<ToolResponse<string>> {
        const result = await Tools.Memory.deleteMemory({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            title: requireText(params?.title, 'title'),
        });
        return { success: typeof result === 'string' && result.length > 0, message: 'Memory deleted', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function move_memory_impl(params: MoveMemoryParams): Promise<ToolResponse<string>> {
        const result = await Tools.Memory.move({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            targetFolderPath: requireText(params?.target_folder_path, 'target_folder_path'),
            titles: parseTitles(params?.titles),
            sourceFolderPath: params.source_folder_path,
        });
        return { success: typeof result === 'string' && result.length > 0, message: 'Memory moved', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function link_memories_impl(params: LinkMemoriesParams): Promise<ToolResponse<unknown>> {
        const result = await Tools.Memory.link({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            sourceTitle: requireText(params?.source_title, 'source_title'),
            targetTitle: requireText(params?.target_title, 'target_title'),
            linkType: params.link_type,
            weight: params.weight,
            description: params.description,
        });
        return { success: !!result, message: 'Memory link created', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function query_memory_links_impl(params: QueryMemoryLinksParams): Promise<ToolResponse<unknown>> {
        const result = await Tools.Memory.queryLinks({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            linkId: params.link_id,
            sourceTitle: params.source_title,
            targetTitle: params.target_title,
            linkType: params.link_type,
            limit: params.limit,
        });
        return { success: !!result, message: 'Memory link query completed', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function update_memory_link_impl(params: UpdateMemoryLinkParams): Promise<ToolResponse<unknown>> {
        const result = await Tools.Memory.updateLink({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            linkId: params.link_id,
            sourceTitle: params.source_title,
            targetTitle: params.target_title,
            linkType: params.link_type,
            newLinkType: params.new_link_type,
            weight: params.weight,
            description: params.description,
        });
        return { success: !!result, message: 'Memory link updated', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function delete_memory_link_impl(params: DeleteMemoryLinkParams): Promise<ToolResponse<string>> {
        const result = await Tools.Memory.deleteLink({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            linkId: params.link_id,
            sourceTitle: params.source_title,
            targetTitle: params.target_title,
            linkType: params.link_type,
        });
        return { success: typeof result === 'string' ? result.length > 0 : !!result, message: 'Memory link deleted', data: result };
    }

    /** Executes this memory operation in the active caller's bound store. */
    async function update_user_preferences_impl(params: UpdateUserPreferencesParams): Promise<ToolResponse<string>> {
        const result = await Tools.Memory.updateUserPreferences({
            targetOwnerKey: await getBoundMemoryOwnerKey(),
            content: requireText(params?.content, 'content'),
        });
        return { success: typeof result === 'string' && result.length > 0, message: 'USER.md updated', data: result };
    }

    /** Completes a tool invocation with its result or reported error. */
    async function wrapToolExecution<P, T>(func: (params: P) => Promise<ToolResponse<T>>, params: P): Promise<void> {
        try {
            const result = await func(params);
            complete(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Tool ${func.name} failed unexpectedly`, error);
            complete({
                success: false,
                message: `Tool execution failed: ${message}`,
            });
        }
    }

    /** Reports the memory tools provided by this package. */
    async function main(): Promise<void> {
        complete({
            success: true,
            message: 'extended_memory_tools package loaded',
            data: {
                tools: [
                    'create_memory',
                    'update_memory',
                    'delete_memory',
                    'move_memory',
                    'link_memories',
                    'query_memory_links',
                    'update_memory_link',
                    'delete_memory_link',
                    'update_user_preferences',
                ],
            },
        });
    }

    return {
        create_memory: (params: CreateMemoryParams) => wrapToolExecution(create_memory_impl, params),
        update_memory: (params: UpdateMemoryParams) => wrapToolExecution(update_memory_impl, params),
        delete_memory: (params: DeleteMemoryParams) => wrapToolExecution(delete_memory_impl, params),
        move_memory: (params: MoveMemoryParams) => wrapToolExecution(move_memory_impl, params),
        link_memories: (params: LinkMemoriesParams) => wrapToolExecution(link_memories_impl, params),
        query_memory_links: (params: QueryMemoryLinksParams) => wrapToolExecution(query_memory_links_impl, params),
        update_memory_link: (params: UpdateMemoryLinkParams) => wrapToolExecution(update_memory_link_impl, params),
        delete_memory_link: (params: DeleteMemoryLinkParams) => wrapToolExecution(delete_memory_link_impl, params),
        update_user_preferences: (params: UpdateUserPreferencesParams) => wrapToolExecution(update_user_preferences_impl, params),
        main,
    };
})();

exports.create_memory = ExtendedMemoryTools.create_memory;
exports.update_memory = ExtendedMemoryTools.update_memory;
exports.delete_memory = ExtendedMemoryTools.delete_memory;
exports.move_memory = ExtendedMemoryTools.move_memory;
exports.link_memories = ExtendedMemoryTools.link_memories;
exports.query_memory_links = ExtendedMemoryTools.query_memory_links;
exports.update_memory_link = ExtendedMemoryTools.update_memory_link;
exports.delete_memory_link = ExtendedMemoryTools.delete_memory_link;
exports.update_user_preferences = ExtendedMemoryTools.update_user_preferences;
exports.main = ExtendedMemoryTools.main;
