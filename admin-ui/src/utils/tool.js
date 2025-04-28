import CryptoJS from "crypto-js";

export const download = (data, fileName) => {
  // Base64 编码字符串
  const base64Data = data;

  // 解码 Base64 数据
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  // 将解码后的数据转换为 Uint8Array
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  // 创建 Blob 对象
  const blob = new Blob(byteArrays, { type: "application/octet-stream" });

  // 创建下载链接
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName; // 设置下载文件的名称
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// AES-GCM 加密模式
const key = CryptoJS.enc.Utf8.parse("OS7kWn9kGLmr7wxD");
const iv = CryptoJS.enc.Utf8.parse("AgBJQGRaHehjSgjT");
// 加密
export function aesEncrypt(data) {
  // CBC 加密方式，ZeroPadding 填充方式
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encrypted.toString();
}
// 解密
export function aesDecrypt(data) {
  // CBC 加密方式，ZeroPadding 填充方式
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 在输入字符串的中文和英文字符之间添加空格
 *
 * @param keyword 输入的字符串
 * @returns 返回处理后的字符串
 */
export function addStringBetweenChars(keyword) {
  let newString = "";
  for (let i = 0; i < keyword.length - 1; i++) {
    newString += keyword[i];
    let regex_zh = /^[\u4e00-\u9fa5]$/;
    let regex_en = /^[0-9A-Za-z]*$/;
    // 当前为中字符但是下一个是英文字符或数字
    if (regex_zh.test(keyword[i]) && regex_en.test(keyword[i + 1])) {
      newString += " "; // 在中文和英文字符之间加上字符串
    }
    // 当前为英文字符或数字但是下一个是中文字符
    if (regex_en.test(keyword[i]) && regex_zh.test(keyword[i + 1])) {
      newString += " ";
    }
  }
  newString += keyword[keyword.length - 1];
  return newString;
}

/**
 * 根据关键词生成正则表达式
 * 匹配规则：关键词根据空格切分成一个数组，用这个数组构造一个正则表达式，遍历数组的每一项，构造的正则表达式按顺序包含数组中字符串元素，且两个元素中间可能有非数字非中文非英文的字符
 *
 * @param keyword 关键词
 * @returns 返回生成的正则表达式对象
 */
export function createRegex(keyword) {
  // 去除空格
  const keywordArray = keyword.split(" ").filter((item) => !!item);

  const len = keywordArray.length;
  const regexString = keywordArray
    .map((item, index) => {
      if (index < len - 1) {
        return `${item}[^0-9a-zA-Z\u4e00-\u9fa5]*`;
      } else {
        return `${item}`;
      }
    })
    .join("");
  return new RegExp(regexString);
}

export function downloadFile(url) {
  const fileUrl = import.meta.env.VITE_API_URL + url;
  // const fileUrl = window.location.origin + '/api/v1' + url;
  console.log(fileUrl, "----fileUrl");
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  // // downloadLink.download = '自定义文件名';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
