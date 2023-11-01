export enum SERVICES {
  USER_SERVICE = 'USER_SERVICE',
}

export const API_TAGS = {};

export const API_REQUESTS = {};

export const RMQ_MESSAGES = {};

export const CONTROLLERS = {};

export const errorResponse = (error: any) => {
  return {
    statusCode: error?.statusCode || error?.status || 400,
    message: typeof error === 'string' ? error : error.message || 'Bad Request',
    errors: error.name || error,
    data: null,
  };
};
