import { revalidatePath } from "next/cache";
import { getPageContentRepo } from "@/lib/data/repository";
import {
  markTranslationFieldAsManaged,
  readPageContentTranslationMeta,
  releaseTranslationFields,
  resolveTranslationFieldPairs,
  stripInternalPageContentFields,
  writePageContentTranslationMeta,
} from "@/lib/admin/page-content-translation";
import { translateText } from "@/lib/admin/translation-service";
import {
  getFrontendPaths,
  sanitizePageContentData,
  type ValidPageId,
} from "@/lib/page-content";

type JobStatus = "pending" | "running" | "completed" | "failed";

interface TranslationJobTask {
  sourceField: string;
  targetField: string;
  sourceValue: string;
}

export interface PageContentTranslationJobState {
  id: string;
  pageId: ValidPageId;
  status: JobStatus;
  message: string;
  total: number;
  completed: number;
  currentField: string | null;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

interface QueueJobInput {
  pageId: ValidPageId;
  zhData: Record<string, string>;
  changedSourceFields: string[];
}

declare global {
  var __pageContentTranslationJobs__: Map<string, PageContentTranslationJobState> | undefined;
}

function getJobStore() {
  if (!globalThis.__pageContentTranslationJobs__) {
    globalThis.__pageContentTranslationJobs__ = new Map();
  }
  return globalThis.__pageContentTranslationJobs__;
}

function setJobState(job: PageContentTranslationJobState) {
  getJobStore().set(job.id, job);
  return job;
}

async function buildTranslationTasks({ pageId, zhData, changedSourceFields }: QueueJobInput) {
  const repo = getPageContentRepo();
  const enRecord = await repo.get(pageId, "en");
  const enData = stripInternalPageContentFields(enRecord?.data);
  const tasks: TranslationJobTask[] = [];
  const candidateSourceFields = Array.from(new Set(Object.keys(zhData)));

  for (const pair of resolveTranslationFieldPairs(pageId, candidateSourceFields)) {
    const sourceValue = zhData[pair.sourceField] ?? "";
    const currentEnValue = enData[pair.targetField] ?? "";
    if (currentEnValue === "" && sourceValue.trim() === "") {
      continue;
    }

    tasks.push({
      sourceField: pair.sourceField,
      targetField: pair.targetField,
      sourceValue,
    });
  }

  return tasks;
}

async function runTranslationJob(jobId: string, input: QueueJobInput, tasks: TranslationJobTask[]) {
  const repo = getPageContentRepo();
  const baseJob = getJobStore().get(jobId);
  if (!baseJob) return;

  setJobState({
    ...baseJob,
    status: "running",
    message: tasks.length === 0 ? "本次没有需要增量翻译的字段" : "正在自动翻译英文内容",
  });

  if (tasks.length === 0) {
    setJobState({
      ...getJobStore().get(jobId)!,
      status: "completed",
      completed: 0,
      currentField: null,
      finishedAt: new Date().toISOString(),
      message: "本次没有需要增量翻译的字段",
    });
    return;
  }

  try {
    const enRecord = await repo.get(input.pageId, "en");
    const enData = stripInternalPageContentFields(enRecord?.data);
    let enMeta = readPageContentTranslationMeta(enRecord?.data);
    const nextEnData = { ...enData };

    for (let index = 0; index < tasks.length; index += 1) {
      const task = tasks[index];
      const runningJob = getJobStore().get(jobId);
      if (!runningJob) return;

      setJobState({
        ...runningJob,
        currentField: task.targetField,
        message: `正在翻译 ${index + 1} / ${tasks.length}`,
      });

      if (!task.sourceValue.trim()) {
        nextEnData[task.targetField] = "";
        enMeta = releaseTranslationFields(enMeta, [task.targetField]);
      } else {
        nextEnData[task.targetField] = await translateText(task.sourceValue, "zh", "en");
        const now = new Date().toISOString();
        enMeta = markTranslationFieldAsManaged(
          enMeta,
          task.targetField,
          task.sourceField,
          task.sourceValue,
          now
        );
      }

      setJobState({
        ...getJobStore().get(jobId)!,
        completed: index + 1,
      });
    }

    const payload = writePageContentTranslationMeta(
      sanitizePageContentData(input.pageId, nextEnData),
      enMeta
    );
    await repo.upsert(input.pageId, "en", payload);

    revalidatePath("/api/page-content");
    for (const path of getFrontendPaths(input.pageId)) {
      revalidatePath(path);
    }

    setJobState({
      ...getJobStore().get(jobId)!,
      status: "completed",
      currentField: null,
      finishedAt: new Date().toISOString(),
      message: "英文已自动翻译并保存",
    });
  } catch (error) {
    setJobState({
      ...getJobStore().get(jobId)!,
      status: "failed",
      currentField: null,
      finishedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "自动翻译失败",
      message: "自动翻译失败",
    });
  }
}

export async function queuePageContentTranslationJob(input: QueueJobInput) {
  const tasks = await buildTranslationTasks(input);
  const now = new Date().toISOString();
  const job: PageContentTranslationJobState = {
    id: `page_translation_${crypto.randomUUID()}`,
    pageId: input.pageId,
    status: "pending",
    message: tasks.length === 0 ? "本次没有需要增量翻译的字段" : "已创建自动翻译任务",
    total: tasks.length,
    completed: 0,
    currentField: null,
    error: null,
    startedAt: now,
    finishedAt: tasks.length === 0 ? now : null,
  };

  setJobState(job);

  if (tasks.length === 0) {
    setJobState({
      ...job,
      status: "completed",
    });
    return job;
  }

  void runTranslationJob(job.id, input, tasks);
  return job;
}

export function getPageContentTranslationJob(jobId: string) {
  return getJobStore().get(jobId) ?? null;
}
