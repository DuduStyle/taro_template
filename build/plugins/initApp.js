/**
 * 合并模版和配置项生成app.tsx文件
 */

const fs = require('fs')
let pages = require('./../../src/pages/routes.js')

pages.forEach((item,index)=>{
  pages[index] = `
      "${item}"`
})

pages = `    pages: [${pages}
    ],`

const initApp = () => {

  const appTemplate = fs.readFileSync('./build/template/app.tsx').toString().split("\n")
  console.log('读取app.tsx模版')

  const pageLine = appTemplate.findIndex((item)=>item.indexOf('pages: []')>-1)
  appTemplate[pageLine] = pages

  const templateStr = `/**
 * 注意：此文件为编译时自动生成，如需修改入口文件请前往 build/template/app.tsx
*/

${appTemplate.join('\n')}`

  if ( fs.existsSync('./src/app.tsx') ) {
    fs.unlinkSync('./src/app.tsx')
  }
  fs.writeFileSync('./src/app.tsx', templateStr)
  console.log('app.tsx初始化成功')
}

module.exports = initApp
