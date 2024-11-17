import { TemplateConfig } from '../types';
import { defaultTemplate } from './default';

// 导出所有模板
export const templates: TemplateConfig[] = [
  defaultTemplate,
  // 在这里添加更多模板
];

// 获取默认模板
export const getDefaultTemplate = (): TemplateConfig => defaultTemplate;

// 根据ID获取模板
export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return templates.find(template => template.id === id);
};
