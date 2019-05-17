class Cat {
    constructor(options) {
        this.$options =options
        //数据响应话
        this.$data = options.data
        this.observe(this.$data)
        
        new Compile(options.el,this);

        // created 执行
        if(options.created){
            // call()方法指定this
            options.created.call(this);
        }
    }

    observe(value) {
        if(!value || typeof value !== 'object'){
            return
        }

        //遍历对象
        Object.keys(value).forEach(key =>{
            this.defineReactive(value,key,value[key])

            // 代理data 中属性到实例
            this.proxyData(key)
        })
    }
    //数据响应话
    defineReactive(obj,key,val){
        this.observe(val) //递归解决数据嵌套
        const dep = new Dep()
        Object.defineProperty(obj,key,{
            get(){
                Dep.target && dep.addDep(Dep.target)
                return val;
            },
            set(Newval){
                if(Newval === val){
                    return
                }
                val = Newval;
                // console.log(`${key}属性更新：${val}`)
                dep.notify()
            }
        })
    }

    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key]
            },
            set(newVal){
                this.$data[key] = newVal
            }
        })
    }
    
   
}
// Dep 管理Watcher
class Dep{
    constructor(){
        // 这里存放Watcher
        this.deps = []
    }
    addDep(dep){
        this.deps.push(dep)
    }
    notify(){
        this.deps.forEach(dep=>dep.update())
    }
}

class Watcher {
    constructor (vm,key,cb){
        this.vm = vm
        this.key = key
        this.cb = cb

        // 将当前watcher实例制定到Dep静态属性target
        Dep.target = this
        this.vm[this.key]; // 触发getter，添加依赖
        Dep.target = null
    }
    update (){
        // console.log(`属性更新`)
        this.cb.call(this.vm,this.vm[this.key]);
    }
}