import { BaseConfig } from './base';
import { FieldConfig } from './fields';

// 导航项配置
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

// 模板配置类型
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  base: BaseConfig;
  fields: FieldConfig[];
  navigation: NavItem[];
}
