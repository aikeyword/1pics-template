import { TemplateConfig } from '../types';

export const defaultTemplate: TemplateConfig = {
  id: 'default',
  name: '默认模板',
  description: '标准的图片生成模板',
  base: {
    WEBHOOK_URL: 'https://aigenai-aiflow.hf.space/webhook/weapp',
    USER_ID: '1fc6a0ce97e0459ea1082ee0e2815053',
    API_KEY: 'E4gLIKyyt9iW',
    TEMPLATE_ID: 'ep-pfzqT2QSij6d',
    NAVIGATION: {
      VIDEO_TUTORIAL: 'https://space.bilibili.com/3493076850968674',
      GITHUB: 'https://github.com/aigem/videos',
      TEMPLATE: 'https://github.com/aigem/videos',
      ABOUT: 'https://1pages.nbid.bid/'
    },
    DEFAULT_IMAGE: '/images/default.png'
  },
  navigation: [
    {
      id: 'video',
      label: '视频教程',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      href: 'https://space.bilibili.com/3493076850968674'
    },
    {
      id: 'github',
      label: 'Github',
      icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
      href: 'https://github.com/aigem/videos'
    },
    {
      id: 'template',
      label: '模板定制',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      href: 'https://github.com/aigem/videos'
    },
    {
      id: 'about',
      label: '关于',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      href: 'https://1pages.nbid.bid/'
    }
  ],
  fields: [
    {
      id: 'title',
      label: '标题',
      type: 'text',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      placeholder: '请输入标题',
      visible: true,
      description: '图片的标题内容'
    },
    {
      id: 'name',
      label: '名称',
      type: 'text',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      placeholder: '请输入名称',
      visible: true,
      description: '图片的name'
    },
    {
      id: 'desc',
      label: '描述',
      type: 'textarea',
      rows: 3,
      validation: {
        required: true,
        minLength: 2,
        maxLength: 300
      },
      placeholder: '请输入详细描述',
      visible: true,
      description: '图片中的描述信息'
    },
    {
      id: 'warning',
      label: '注意事项',
      type: 'text',
      validation: {
        maxLength: 200
      },
      placeholder: '请输入注意事项',
      visible: true,
      description: '图片中的warning信息'
    },
    {
      id: 'contact',
      label: '联系方式',
      type: 'text',
      validation: {
        maxLength: 100
      },
      placeholder: '请输入邮箱地址',
      visible: true,
      description: '图片中的联系部分内容'
    },
    {
      id: 'img_URL',
      label: '图片链接',
      visible: true,
      description: '可用的图片外链 例如: https://uuqu.win/gallery_gen/a38793550e1e98534ba872e65b4457c2_fit.png',
      type: 'url',
    },
    {
      id: 'OE_USER_ID',
      type: 'hidden',
      label: 'User ID',
      defaultValue: '1fc6a0ce97e0459ea1082ee0e2815053',
      visible: false
    },
    {
      id: 'OE_API_KEY',
      type: 'hidden',
      label: 'API Key',
      defaultValue: 'E4gLIKyyt9iW',
      visible: false
    },
    {
      id: 'OE_TEMPLATE_ID',
      type: 'hidden',
      label: 'Template ID',
      defaultValue: 'ep-pfzqT2QSij6d',
      visible: false
    }
  ]
};
