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
