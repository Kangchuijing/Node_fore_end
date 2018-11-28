var cookie = {

    // 得到指定key的cookie信息
    getCookie: function (key) {
        var arr = document.cookie.split(';');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].split('=')[0] == key) {
                var obj = JSON.parse(arr[i].split('=')[1]);
                return obj;   // 如果存在这个key，那么就以对象的形式返回这个key对应的值
            }
        }
        // 如果不存在，那么就返回一个null，表明找不到数据
        return null;
    },

    // 设置cookie信息： key，value，expries
    setCookie: function (key, value, expries) {
        var str = JSON.stringify(value);
        document.cookie = key + "=" + str + "; expries=" + expries + ", /";
    }
}