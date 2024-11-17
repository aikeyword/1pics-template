// 字段验证规则类型
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidation?: (value: string) => boolean | string;
}

// 字段配置接口
export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'hidden' | 'number';
  validation?: ValidationRule;
  defaultValue?: string;
  placeholder?: string;
  visible?: boolean;
  rows?: number;
  description?: string;
  className?: string;
}
