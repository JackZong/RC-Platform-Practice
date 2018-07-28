var API = 'https://platform.devtest.ringcentral.com'
const Request = function(url, options){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.responseType = 'json'
        xhr.onreadystatechange = function(){
            if(xhr.readyState !== 4) {
                return
            }
            if(xhr.status === 200) {
                resolve(JSON.parse(xhr.response))
            } else {
                reject(new Error(xhr.statusText))
            }
        }
        if(options.method === 'GET') {
            xhr.open(options.method, API + url + window.location.search, true)
        } else {
            xhr.open(options.method, API + url, true)
        }

        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
        xhr.send(JSON.stringify(options.data))
    })
}
export default Request