import { getDefaultTemplate } from './templates';

const template = getDefaultTemplate();
export const CONFIG = template.base;
export const FORM_FIELDS = template.fields;

// POST请求体的转换函数
export const transformFormData = (data: Record<string, any>) => {
  // 创建一个新的对象来存储转换后的数据
  const transformedData: Record<string, any> = {};

  // 遍历所有字段配置
  FORM_FIELDS.forEach(field => {
    // 只包含配置中定义的字段
    if (field.id in data) {
      // 根据字段类型处理数据
      switch (field.type) {
        case 'text':
        case 'textarea':
          transformedData[field.id] = data[field.id].trim();
          break;
        case 'url':
          transformedData[field.id] = data[field.id] || '';
          break;
        case 'hidden':
          transformedData[field.id] = field.defaultValue || data[field.id];
          break;
        default:
          transformedData[field.id] = data[field.id];
      }
    }
  });

  return transformedData;
};
