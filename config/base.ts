// 基础配置接口定义
export interface BaseConfig {
  WEBHOOK_URL: string;
  USER_ID: string;
  API_KEY: string;
  TEMPLATE_ID: string;
  NAVIGATION: {
    VIDEO_TUTORIAL: string;
    GITHUB: string;
    TEMPLATE: string;
    ABOUT: string;
  };
  DEFAULT_IMAGE: string;
}
