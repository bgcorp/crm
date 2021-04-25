import M from 'materialize-css'

export default {
  install(app) {
    app.config.globalProperties.$message = (html) => {
      M.toast({ html })
    }

    app.config.globalProperties.$error = (html) => {
      M.toast({ html: `[Error]: ${html}` })
    }
  }
}
