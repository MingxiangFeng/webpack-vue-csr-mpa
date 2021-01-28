import createApp from './app'

const getData = function() {
  return new Promise((resolve, reject) => {
    let str = 'this is a async data!'
    resolve(str)
  })
}

export default context => {
  return new Promise(async (resolve, reject) => {
    let { url } = context

    // 数据获取
    context.propsData = 'this is static data!'
    context.asyncData = await getData()


    let { app, router } = createApp(context)
    router.push(url)

    router.onReady(() => {
      let matchComponents = router.getMatchedComponents()
      if(!matchComponents.length) {
        return reject()
      }
      resolve(app)
    }, reject)
  })
}

