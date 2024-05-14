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


export {
  formatListData,
  formatTime
}