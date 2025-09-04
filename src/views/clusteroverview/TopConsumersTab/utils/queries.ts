import { TopConsumerMetric as Metric } from './topConsumerMetric';
import { TopConsumerScope as Scope } from './topConsumerScope';

const topConsumerQueries = {
  [Scope.NODE.getValue()]: {
    [Metric.CPU.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_cpu_usage_seconds_total[${duration}])) by (node))) > 0`,
    [Metric.MEMORY_SWAP_TRAFFIC.getValue()]: (numItemsToShow) =>
      `sort_desc(topk(${numItemsToShow}, sum(kubevirt_vmi_memory_swap_in_traffic_bytes + kubevirt_vmi_memory_swap_out_traffic_bytes) by (node))) > 0`,
    [Metric.MEMORY.getValue()]: (numItemsToShow) =>
      `sort_desc(topk(${numItemsToShow}, sum(kubevirt_vmi_memory_used_bytes) by(node))) > 0`,
    [Metric.STORAGE_IOPS.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_storage_iops_read_total[${duration}]) + rate(kubevirt_vmi_storage_iops_write_total[${duration}])) by (node))) > 0`,
    [Metric.STORAGE_READ_LATENCY.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum by (node)(rate(kubevirt_vmi_storage_read_times_seconds_total[${duration}]) / sum by (node)(rate(kubevirt_vmi_storage_iops_read_total[${duration}]) > 0))))`,
    [Metric.STORAGE_THROUGHPUT.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_storage_read_traffic_bytes_total[${duration}]) + rate(kubevirt_vmi_storage_write_traffic_bytes_total[${duration}])) by (node))) > 0`,
    [Metric.STORAGE_WRITE_LATENCY.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum by (node)(rate(kubevirt_vmi_storage_write_times_seconds_total[${duration}]) / sum by (node)(rate(kubevirt_vmi_storage_iops_write_total[${duration}]) > 0))))`,
    [Metric.VCPU_WAIT.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_vcpu_wait_seconds_total[${duration}])) by (node))) > 0`,
  },
  [Scope.PROJECT.getValue()]: {
    [Metric.CPU.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_cpu_usage_seconds_total[${duration}])) by (namespace))) > 0`,
    [Metric.MEMORY_SWAP_TRAFFIC.getValue()]: (numItemsToShow) =>
      `sort_desc(topk(${numItemsToShow}, sum(kubevirt_vmi_memory_swap_in_traffic_bytes + kubevirt_vmi_memory_swap_out_traffic_bytes) by (namespace))) > 0`,
    [Metric.MEMORY.getValue()]: (numItemsToShow) =>
      `sort_desc(topk(${numItemsToShow}, sum(kubevirt_vmi_memory_used_bytes) by (namespace))) > 0`,
    [Metric.STORAGE_IOPS.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_storage_iops_read_total[${duration}]) + rate(kubevirt_vmi_storage_iops_write_total[${duration}])) by (namespace))) > 0`,
    [Metric.STORAGE_READ_LATENCY.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum by (namespace)(rate(kubevirt_vmi_storage_read_times_seconds_total[${duration}]) / sum by (node)(rate(kubevirt_vmi_storage_iops_read_total[${duration}]) > 0))))`,
    [Metric.STORAGE_THROUGHPUT.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_storage_read_traffic_bytes_total[${duration}]) + rate(kubevirt_vmi_storage_write_traffic_bytes_total[${duration}])) by (namespace))) > 0`,
    [Metric.STORAGE_WRITE_LATENCY.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum by (namespace)(rate(kubevirt_vmi_storage_write_times_seconds_total[${duration}]) / sum by (node)(rate(kubevirt_vmi_storage_iops_write_total[${duration}]) > 0))))`,
    [Metric.VCPU_WAIT.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_vcpu_wait_seconds_total[${duration}])) by (namespace))) > 0`,
  },
  [Scope.VM.getValue()]: {
    [Metric.CPU.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_cpu_usage_seconds_total[${duration}])) BY (name, namespace)))`,
    [Metric.MEMORY_SWAP_TRAFFIC.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk (${numItemsToShow}, sum(rate(kubevirt_vmi_memory_swap_in_traffic_bytes[${duration}]) + rate(kubevirt_vmi_memory_swap_out_traffic_bytes[${duration}]))by(name, namespace))) > 0`,
    [Metric.MEMORY.getValue()]: (numItemsToShow) =>
      `sort_desc(topk(${numItemsToShow}, sum(kubevirt_vmi_memory_used_bytes) by(name, namespace))) > 0`,
    [Metric.STORAGE_IOPS.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_storage_iops_read_total[${duration}]) + rate(kubevirt_vmi_storage_iops_write_total[${duration}])) by (namespace, name))) > 0`,
    [Metric.STORAGE_READ_LATENCY.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, avg by (name, namespace)(rate(kubevirt_vmi_storage_read_times_seconds_total[${duration}]) / rate(kubevirt_vmi_storage_iops_read_total[${duration}]) > 0)))`,
    [Metric.STORAGE_THROUGHPUT.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_storage_read_traffic_bytes_total[${duration}]) + rate(kubevirt_vmi_storage_write_traffic_bytes_total[${duration}])) by (namespace, name))) > 0`,
    [Metric.STORAGE_WRITE_LATENCY.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, avg by (name, namespace)(rate(kubevirt_vmi_storage_write_times_seconds_total[${duration}]) / rate(kubevirt_vmi_storage_iops_write_total[${duration}]) > 0)))`,
    [Metric.VCPU_WAIT.getValue()]: (numItemsToShow, duration) =>
      `sort_desc(topk(${numItemsToShow}, sum(rate(kubevirt_vmi_vcpu_wait_seconds_total[${duration}])) by (namespace, name))) > 0`,
  },
};

export const getTopConsumerQuery = (metric, scope, numItemsToShow = 5, duration = '5m') =>
  topConsumerQueries?.[scope]?.[metric]?.(numItemsToShow, duration);
