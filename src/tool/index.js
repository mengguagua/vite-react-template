// 获取url上变量
export let getQueryStringArgs = () => {
  let queryData = '';
  if (location.search) {
    queryData = location.search;
  } else if (location.hash) {
    queryData = '?' + location.hash.split('?')[1];
  }
  let qs = (queryData.length > 0 ? queryData.substring(1) : '');
  let args = [];
  for (let item of qs.split('&').map( kv => kv.split('=') )) {
    let name = decodeURIComponent(item[0]);
    let value = decodeURIComponent(item[1]);
    if (name) {
      args[name] = value;
    }
  }
  return args;
};
// 示例
// let args = getQueryStringArgs();
// let name = args['name']

// 对象数组，根据对象的某个key去重
export let noRepeatObjArray = (array1, array2, key) => {
  let objArray = [...array1, ...array2];
  // 创建一个对象,来存储 id 不重复
  let uniqueObjects = {};
  // 迭代对象数组
  objArray.forEach( (obj) => {
    // 如果对象的 id 不在 uniqueObjects 中，则将该对象添加到 uniqueObjects 中
    if (!uniqueObjects.hasOwnProperty(obj[key])) {
      uniqueObjects[obj[key]] = obj;
    }
  });
  // 将 uniqueObjects 中的值转换为数组
  let uniqueArray = Object.values(uniqueObjects);
  return uniqueArray;
};

// 浏览器环境生产uuid
export let generateUUID = () => {
  // 使用crypto API生成一个随机的Uint32数组
  const cryptoObj = window.crypto || window.msCrypto; // 兼容不同浏览器
  const array = new Uint32Array(4);
  cryptoObj.getRandomValues(array);

  // 将Uint32数组转换为UUID格式
  const uuid = array.reduce((acc, value, index) => {
    if (index === 0 || index === 1) {
      acc += value.toString(16).padStart(8, '0');
    } else if (index === 2) {
      acc += `-${value.toString(16).padStart(4, '0')}`;
    } else if (index === 3) {
      acc += `-${(value & 0x0fff | 0x4000).toString(16).padStart(4, '0')}`;
    } else {
      acc += `-${value.toString(16).padStart(12, '0')}`;
    }
    return acc;
  }, '');

  return uuid;
}
// 示例
// const myUUID = generateUUID();
// console.log(myUUID);


export let rsaEncypt = (data) => {
  // 在index.html引入了
  const encryptor = new JSEncrypt();
  const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdxfsl++o053QZsJy+iu5J6ojNF+urW4AuzJN3rswrWdAD44Dio1Cvhxa977nmK0oN9JgkGGYYp6AZyWmDwY+JYQImuWIrcOCEC5X5sR9vx7M3VjOGlU48iVGHIrBp51jDj/gV9FJPZwOS3BLEeitexJQRFpcvczDFDTe7jMnb4wIDAQAB';
  encryptor.setPublicKey(pubKey);
  return encryptor.encryptLong(data);
}

// 下载流通用处理方式，如果是word则设置为msword，excel为excel
export let downloadFile = (res, type = 'application/pdf;chartset=UTF-8', filename) =>{
  // 创建blob对象，解析流数据
  const blob = new Blob([res], {
    // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
    type: type
  })
  const a = document.createElement('a')
  // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
  const URL = window.URL || window.webkitURL
  // 根据解析后的blob对象创建URL 对象
  const herf = URL.createObjectURL(blob)
  // 下载链接
  a.href = herf
  // 下载文件名
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 在内存中移除URL 对象
  window.URL.revokeObjectURL(herf)
};

// 偏离当前几天的日期, num负数为往前几天
export let getAnyDayFormatDate = (num) => {
  let date = new Date();
  let seperator = '-';
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  let date2 = new Date(date);
  date2.setDate(date.getDate() + num);
  let year2 = date2.getFullYear();
  let month2 = date2.getMonth() + 1;
  let strDate2 = date2.getDate();
  if (month2 >= 1 && month2 <= 9) {
    month2 = '0' + month2;
  }
  if (strDate2 >= 0 && strDate2 <= 9) {
    strDate2 = '0' + strDate2;
  }

  let startFormatDate = year2 + seperator + month2 + seperator + strDate2;
  let endFormatDate = year + seperator + month + seperator + strDate;
  return [startFormatDate, endFormatDate];
};

const fileUtil = {
  /** 通过base64字符串生成文件 */
  downloadFileByBase64: function(base64Str, fileName) {
    let myBlob = this.dataURLtoBlob(base64Str)
    let myUrl = URL.createObjectURL(myBlob)
    this.downloadFile(myUrl, fileName)
  },
  /**封装base64Str blob对象*/
  dataURLtoBlob: function (base64Str) {
    let bstr = atob(base64Str), n = bstr.length, u8arr = new Uint8Array(n);
    alert(JSON.stringify(bstr))
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr]);
  },
  /**创建一个a标签，并做下载点击事件*/
  downloadFile: function (hrefUrl, fileName) {
    let a = document.createElement("a")
    a.setAttribute("href", hrefUrl)
    a.setAttribute("download", fileName)
    a.setAttribute("target", "_blank")
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
  }
}
export default fileUtil
