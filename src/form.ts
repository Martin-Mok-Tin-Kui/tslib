import FormData from 'form-data';
import { fetch } from './fetch';
import { JsonObject } from './json';
import { decodeResponse } from './response';

export function jsonToFormData(
  json: JsonObject,
  formData: FormData = new FormData(),
) {
  Object.keys(json).forEach(key => {
    const value = json[key];
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        formData.append(key, value.toString());
        break;
      default:
        if (typeof File !== 'undefined' && value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(value => formData.append(key, value));
        } else {
          formData.append(key, JSON.stringify(value));
        }
    }
  });
  return formData;
}

export interface PostFormResponse<T> {
  status: number;
  statusText: string;
  data: Buffer | string | T;
}

export function postMultipartFormData<T>(
  url: string,
  json: JsonObject,
): Promise<PostFormResponse<T>> {
  const formData = new FormData();
  jsonToFormData(json, formData);
  return fetch(url, { method: 'POST', body: formData as any }).then(res =>
    decodeResponse(res).then(
      (data): PostFormResponse<T> => {
        return {
          status: res.status,
          statusText: res.statusText,
          data: data as any,
        };
      },
    ),
  );
}
