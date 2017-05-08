define(function(require) {
    //利用Promise封装一个加载函数,也可以单独放在一个功能模块中进一步优化
    //complete属性在各个浏览器下表现不同,不建议使用
    var imageLoad = function(img) {
        return new Promise(function(resolve, reject) {         
            if(img.complete) {
                resolve();
            }else{
                img.onload = function(event) {
                    resolve(event);
                }
                img.onerror = function(err) {
                    reject(err);
                }
            }
        })
    }
    //模块name(外部容器,图片的class模式)
    var imageCenter = function(domList,mode) {
        domList.forEach(function(item) {
            /*
                获取容器下的img容器尺寸200*150,图片实际尺寸比例itemR(设为X) = 4/3
                图片原始尺寸比例imgR(设为N)
                假设实际尺寸两项都小于容器,
                  1)如果高>>宽,应该让宽=100%,高自动补位然后hidden
                  2)如果宽>>高,应该让高=100%,宽自动补位然后hidden
                然后给img分别加上对应的class
              */
            var img = item.children[0];
            var itemW = item.offsetWidth;
            var itemH = item.offsetHeight;
            var itemR = itemW / itemH;
            imageLoad(img).then(function() {
                var imgW = img.naturalWidth;
                var imgH = img.naturalHeight;
                var imgR = imgW / imgH;
                var resultMode = null;
                switch(mode){
                    case 'aspectFill':
                        resultMode = imgR > 1 ? 'aspectFill-x' : 'aspectFill-y';
                        break;
                    case 'wspectFill':
                        resultMode = itemR > imgR ? 'aspectFill-x' : 'aspectFill-y'
                        break;
                    default:
                }
                $(img).addClass(resultMode);
            })
        })
    }
    return imageCenter;
})
