
const baseHandler = {
    get(target,key) {
    //  const res = target[key]
    const res = Reflect.get(target,key)
     // 收集依赖
     track(target,key)
     return typeof res ==='object'?reactive(res):res
    },
    set(target,key,val) {
        const info = {oldValue:target[key],newVlaue:val}
        // target[key]= val
        Reflect.set(target,key,val)

        trigger(target,key,info)
      // 响应式通知变化
    }
}
function reactive(target) {
    //vue3要考虑map这些对象
    const observed = new Proxy(target,baseHandler)
    // 返回proxy代理后的对象
    return observed

}

function computed(fn,options={}) {
    // 特殊的effect
    const runner = effect(fn,{computed:true,lazy:true})
    return {
        effect:runner,
        get value() {
            return runner()
        }
    }
}

function effect(fn,options={}) {
    // 依赖函数
    // 创建依赖函数
    let e = createReactiveEffect(fn,options)
    // lazy是特殊的computed配置
    if(!options.lazy){
        // 不是懒执行
        e()
    }
     return e
}
function createReactiveEffect(fn,options) {
    
    // 构造固定格式的effect
    const effect = function effect(...args) {
        return run(effect,fn,args)
    }

    // effect的配置
    effect.deps = []
    effect.computed = options.computed
    effect.lazy = options.lazy
    return effect
}

function run (effect,fn,args) {
    // 真正执行effect
    try {
        effectStack.push(effect)
        return fn(...args)
    }finally {
        effectStack.pop()
    }
    
}
let effectStack = []//存储effect
let targetMap = new WeakMap()
function track(target,key) {
    //收集依赖
    const effect = effectStack[effectStack.length-1]
    if(effect) {
        let depMap = targetMap.get(target)
    
        if(depMap===undefined) {
            // 初始化对象作为键对应的属性值
            depMap = new Map()
            targetMap.set(target,depMap)
        }

        let dep = depMap.get(key)
        if(dep ===undefined) {
            // 初始化对象key对应的属性值
            dep = new Set()
            depMap.set(key,dep)
        }
        // 容错
        if(!dep.has(effect)) {
            // 新增依赖
            dep.add(effect)
            // 双向存储方便查找优化
            effect.deps.push(dep)

        }

    }

}
// 用一个巨大的map来收集依赖
// {
//     target1:{
//         key:["依赖函数1","依赖函数2"]
//     },
//     target2:{
//         key:["依赖函数1","依赖函数2"]
//     },

// }


function trigger(target,key) {
//数据变化后,通知更新 执行effect
// 找到依赖
const depMap = targetMap.get(target);
if(depMap===undefined) {
    return
}
// 分开普通的effec和computed有一个优先级
//  effects先执行，computed后执行
// 因为computed可能依赖普通的effects
const effects = new Set()
const computedRunners = new Set()
if(key) {
    // 区分普通的effect和computed
    let deps = depMap.get(key)
     deps.forEach(effect=>{
         if(effect.computed) {
          computedRunners.add(effect)
         } else {
          effects.add(effect)
         }
     })
     // 执行
     effects.forEach(effect=>effect())
     computedRunners.forEach(computed=>computed())
}
 
}
