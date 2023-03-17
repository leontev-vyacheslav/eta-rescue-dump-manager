export type WebWorkerMemoryUsageModel = {
    processId: number;

    processName: string;

    workingSet64: number;
}

export type PerformanceCounterInfoModel = {
    cpuCounterValue: number
}

export type WebWorkerResourceUsageModel = {
    webWorkerMemoryUsages: WebWorkerMemoryUsageModel[],

    performanceCounterInfo: PerformanceCounterInfoModel
}