// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** RAG流式问答 POST /ai/rag/ask/stream */
export async function askStream(body: AiAPI.RAGAskRequest,
                                options ?: { [key: string]: any }
) {
    return request<string[]>('/ai/rag/ask/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 分页获取RAG历史 POST /ai/rag/history/list/page/vo */
export async function listHistoryByPage(body: AiAPI.RAGHistoryQueryRequest,
                                        options ?: { [key: string]: any }
) {
    return request<AiAPI.BaseResponsePageRAGHistoryVO>('/ai/rag/history/list/page/vo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 召回效果分析 POST /ai/rag/recall/analyze */
export async function analyzeRecall(body: AiAPI.RecallAnalysisRequest,
                                    options ?: { [key: string]: any }
) {
    return request<AiAPI.BaseResponseRecallAnalysisVO>('/ai/rag/recall/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 批量召回效果分析 POST /ai/rag/recall/batch/analyze */
export async function batchAnalyzeRecall(body: AiAPI.BatchRecallRequest,
                                         options ?: { [key: string]: any }
) {
    return request<AiAPI.BaseResponseBatchRecallVO>('/ai/rag/recall/batch/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

