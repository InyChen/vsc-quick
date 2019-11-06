import axios from 'axios';
import config from '../config/';
import * as vscode from 'vscode';

axios.defaults.baseURL = config.apiBasePath;

axios.interceptors.request.use(
  function (config) {
    const userName = vscode.workspace.getConfiguration('quick').get('userName');
    const secret = vscode.workspace.getConfiguration('quick').get('secret');
    config.headers["user-name"] = userName || "";
    config.headers.secret = secret || "";
    return config;
  }
);

export default {
  async get(url: string): Promise<any> {
    const rs = await axios.get(url);
    if (rs.status === 200) {
      return rs.data;
    } else {
      return {
        status: rs.status,
        error: "网络错误"
      };
    }
  },
  async post(url: string, params: Object): Promise<any> {
    const rs = await axios.post(url, params);
    if (rs.status === 200) {
      return rs.data;
    } else {
      return {
        status: rs.status,
        error: "网络错误"
      };
    }
  }
};