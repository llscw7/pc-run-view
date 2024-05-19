/**
 * 针对 QuickLinkData 进行快排
 * @param arr 
 */
const quickSort = (arr: any[]): any[] => {
  if(arr.length <= 1) return arr;
  let left = []
  let right = []
  let cur = arr.shift()
  let t1 = cur.createTime.replace(/(-)*/g, '')
  for(let v of arr) {
    let t2 = v.createTime.replace(/(-)*/g, '')
    if(t2 > t1) {
      left.push(v)
    }else {
      right.push(v)
    }
  }
  return quickSort(left).concat(cur, quickSort(right))
}

/**
 * 格式化数据，对数据进行 时间排序+扁平化 处理
 * @param data 
 * @param sort 
 */
const formatListData = (data: QuickLinkData, sort = "default") => {
  if(!data || !Object.keys(data).length) return []
  let res = []
  if(sort === 'default' || sort === 'collect') {
    let arr = Object.values(data.default)
    res = quickSort(arr)
  }else if (sort === 'time') {
    let arr = Object.keys(data).sort((a,b)=> Number(b) - Number(a))
    for(let v of arr) {
      let tmp = Object.values(data[v])
      let q = quickSort(tmp)
      res.push(...q)
    }
  }
  return res
}

function formatTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 查询markdown中的图片
 * 兼容<img />情况 & 存在外部url的图片的情况
 * @param text 
 * @returns 
 */
const queryImage = (text: string) => {
  const arr = []
  let l = 0
  let r = 0
  let first = false
  while(r < text.length) {
    if(text.substring(r, r+24) === '(http://localhost:38435/') {
      l = r + 24
      r = r + 25
      first = true
    }
    if(text[r] === ')' && first) {
      arr.push(text.substring(l, r))
      first = false
    }
    r++
  }
  const res = queryImageByHTML(text)
  arr.concat(res)
  console.log(arr,'======', text)
  return arr
}

const queryImageByHTML = (text: string) => {
  const arr: string[] = []

  const regex = /<img.*?src=(?:"(.*?)"|'(.*?)').*?>/g;
  const matches = text.match(regex);

  if (matches) {
    matches.forEach((match: any) => {
      const src = match.match(/src=(?:"(.*?)"|'(.*?)')/)[1] || match.match(/src=(?:"(.*?)"|'(.*?)')/)[2];
      console.log(match.match(/src=(?:"(.*?)"|'(.*?)')/), '---');
      const name = src.split('http://localhost:38435/')[1]
      arr.push(name)
    });
  }
  return arr
}


export {
  formatListData,
  formatTime,
  queryImage
}