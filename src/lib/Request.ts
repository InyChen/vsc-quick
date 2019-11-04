import axios from 'axios';
import config from '../config/';
import * as vscode from 'vscode';

axios.defaults.baseURL = config.apiBasePath;

axios.interceptors.request.use(
  function (config) {
    const token = vscode.workspace.getConfiguration('quick').get('token');
    vscode.window.showInformationMessage('token:'+token);
    if (token) {
      config.headers.token = token;
    } else {
      console.warn('no token');
    }
    return config;
  },
  function (error) {
    console.log('request error:' + error);
    return Promise.resolve({
      status: 500,
      error: '请求失败,请检查网络:' + error
    });
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    let data = response.data;
    if (data) {
      return data;
    }else{
        vscode.window.showInformationMessage('Hello World!');
    }
    return response;
  },
  function (error) {
    console.log('response error:' + error);
    return Promise.resolve({
      status: 500,
      error: '返回数据处理失败:' + error
    });
  }
);

export default axios;