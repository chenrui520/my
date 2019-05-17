// 用法 new Compile(el,vm)
class Compile{
    constructor(el,vm){
        //遍历宿主节点
        this.$el = document.querySelector(el);
        this.$vm = vm;

        // 编译
        if(this.$el){
            //转换内部内容片段Fragment
            this.$fragement = this.node2Fragment(this.$el);
            //执行编译
            this.compile(this.$fragement);
            //将编译完的html结果追加之$el
            this.$el.appendChild(this.$fragement)
        }
    }

    //将宿主元素中代码拿出遍历
    node2Fragment(el){
        console.log(el)
        const frag = document.createDocumentFragment();
        //将 el中所有子元素搬之frag
        let child
        while(child = el.firstChild){
            frag.appendChild(child)
        }
        return frag
    }

    //编译
    compile(el){
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node =>{
            //类型判断
            if(this.isElement(node)){
                //元素
                // console.log('编译'+node.nodeName)
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr =>{
                    const attrName = attr.name;
                    const exp = attr.value;
                    if(this.isDirective(attrName)){
                        const dir = attrName.substring(2);
                        //执行指令
                        this[dir] && this[dir](node,this.$vm,exp)
                    }
                    if(this.isEvent(attrName)){
                        const dir = attrName.substring(1);
                        this.eventHandler(node,this.$vm,exp,dir)
                    }
                })
            }else if(this.isInterpolation(node)){

                this.compileText(node)
            }

            // 递归子节点
            if(node.childNodes && node.childNodes.length>0){
                this.compile(node)
            }
        })
    }

    compileText(node){
        console.log(node,this.$vm,RegExp.$1)

         this.update(node,this.$vm,RegExp.$1,'text')

    }

    //更新函数
    update(node,vm,exp,dir){
        const updaterFn = this[dir+'Updater']
        // 初始化
        updaterFn && updaterFn(node,vm[exp])
        //依赖收集
        new Watcher(vm,exp,function(value){
        updaterFn && updaterFn(node,value)

        })
    }

    text(node,vm,exp){
        this.update(node,vm,exp,'text')
    }

    // 双向绑定
    model(node,vm,exp){
        // 指定input 的value属性
        this.update(node,vm,exp,'model');
        // 视图对模型相应
        node.addEventListener('input',e=>{
            vm[exp] = e.target.value
        })
    }

    modelUpdater(node,value){
        node.value = value
    }

    textUpdater(node,value){
        node.textContent = value
    }

    eventHandler(node,vm,exp,dir){
        let fn = vm.$options.methods &&vm.$options.methods[exp];
        if(dir&&fn){
            node.addEventListener(dir,fn.bind(vm))
        }

    }

    isDirective(attr){
        return attr.indexOf('c-') ==0;
    }
    isEvent(attr){
        return attr.indexOf('@') == 0;
    }

    isElement(node){
        return node.nodeType === 1;
    }
    //插值文本
    isInterpolation(node){
        return node.nodeType ===3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}