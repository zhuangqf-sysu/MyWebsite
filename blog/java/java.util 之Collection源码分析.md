# java.util 之Collection源码分析

----

*在[java.util 概述之集合框架](http://lovefadai.xyz/content.html?javaId=java.util%20%E6%A6%82%E8%BF%B0%E4%B9%8B%E9%9B%86%E5%90%88%E6%A1%86%E6%9E%B6)中，我们简单了解了java的集合框架。现在让我们从源头上分析java集合框架的源码。*

### 方法总览

Collection接口是java集合框架的根接口，它继承了Iterable接口，提供元素遍历的功能。对于集合框架而言，这个接口定义了集合基本的操作，包括添加、删除、判断是否有元素、清空等：

| Method     | Description |
| ------------- |-------------|
| `boolean add(E a)` | 确保此集合包含指定的元素（可选操作）|
| `boolean addAll(Collection<? extends E> c)` | 将指定集合中的所有元素添加到此集合（可选操作）|
| `void clear()` | 删除集合内所有元素（可选操作）|
|`boolean contains(Object o)`|如果此集合包含指定的元素，则返回 true |
|`boolean containsAll(Collection<?> c)`|如果此集合包含指定 集合中的所有元素，则返回true |
|`boolean equals(Object o)`|将指定的对象与此集合进行比较以获得相等性|
|`int hashCode()`|返回此集合的哈希码值|
|`boolean isEmpty`|如果此集合不包含元素，则返回 true |
|`Iterator<E> iterator()`| 返回集合的迭代器|
|`default Spliterator<T> spliterator()`|返回集合的Spliterator|
|`default void forEach(Consumer<? super E>action)`|对Iterable的每个元素执行给定的操作，直到所有元素都被处理或动作引发异常。 除非实现类另有规定，否则按照迭代的顺序执行操作（如果指定了迭代顺序）|
|`boolean remove(Object o)`|从该集合中删除指定元素的单个实例（如果存在）（可选操作）|
|`boolean removeAll(Collection<?>c)`|删除指定集合中包含的所有此集合的元素（可选操作）|
|`default boolean removeIf(Predicate<? extends E>filter)`|删除满足给定谓词的此集合的所有元素|
|`boolean retainAll(Collection<?> c)`|仅保留此集合中包含在指定集合中的元素（可选操作）|
|`int size()`|返回此集合中的元素数|
|`Object[] toArray()`|返回一个包含此集合中所有元素的数组|
|`<T>T[] toArray(T[] a)` | 返回包含此集合中所有元素的数组; 返回的数组的运行时类型是指定数组的运行时类型|
|`default Stream<E> Stream()`|返回以此集合作为源的Stream| 
|`default Stream<E> parallelStream()`|返回可能并行的以此集合作为源的Stream|

#### 可选操作

> 注明为可选操作的方法，子类可以不实现。

定义接口的根本目的就是为了让具体的类`implement`这个接口，并实现其定义的方法。这样的话，会存在一种情况：接口定义了很多方法，但是部分子类并不需要其中的某个方法，或者说不支持这个方法。比如，Collection接口中的add方法，当我需要实现了一个不可变的集合类（集合内的元素只能被读，而无法增删或者排序）时，这个方法就显得有些冗余，而且会给类的使用者带来困扰。这时我们可以选择抛出异常`throw new UnsupportedOperationException();`。

注明为可选操作的方法，事实上是针对继承`AbstractCollection`的子类而言的，因为在`AbstractCollection`中，这类方法有了一个不能称之为实现的默认实现：

```java
    public boolean add(E e) {
        throw new UnsupportedOperationException();
    }
```

其子类可以根据需要选择是否`override`这些方法，这样做大大增加了框架的灵活性和伸缩性。

### default 方法（defender方法）

> default方法是在java8中引入的关键字，也可称为Virtual
 extension methods——虚拟扩展方法。是指，在接口内部包含了一些默认的方法实现（也就是接口中可以包含方法体，这打破了Java之前版本对接口的语法限制），从而使得接口在进行扩展的时候，不会破坏与接口相关的实现类代码。

我们都知道在java8之前，接口中只能定义方法名，而不能包含方法的具体实现代码。接口中定义的方法必须在接口的非抽象子类中实现。这个语法限制，所以要直接改变/扩展接口内的方法变得非常困难。在尝试强化Java 8 Collections API，让其支持lambda表达式的时候，就面临了这样的挑战。为了克服这个困难，Java 8中引入了一个引入了default关键字。

Collection中定义的default方法有四个：`removeIf()`、‘stream()’、`parallelStream()`、`spliterator()`，还有从Iterable继承而来的`foeEach()`方法。

让我们看一下`stream()`，初步领略一下default方法的魅力：

```java
    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }
```

这样一来，所有继承Collection接口的类就都可以支持Stream方法了，继而支持Lambda表达式，继而可以并行执行某个动作。随着未来编程语言的方法，java势必得随之扩展，但是原有的技术框架和代码不能抛下，default方法无疑是无缝衔接java与函数式编程的一剂良药，也必将为日后jdk的改进立下更大的功劳。

当然，我们也可以用在我们自己的代码中。假设你接手一个老项目。。。。。。（不说了，都是泪）。但是在新代码中，我们应该尽量考虑周全，不能依赖dafault方法，不稳定的类对于开发者来说是很可怕的。

‘stream()’、`parallelStream()`、`spliterator()`这三个方法比较简单，无非就是利用工厂方法用集合对象创建一个对应的对象：
```
    @Override
    default Spliterator<E> spliterator() {
        return Spliterators.spliterator(this, 0);
    }

    default Stream<E> parallelStream() {
        return StreamSupport.stream(spliterator(), true);
    }
```

至于 Spliterator、Stream的具体介绍和用法，在后面我会进行深入学习并分享的。

### AbstractCollection

作为Collection的骨架类，AbstractCollection帮我们实现部分方法，当然也包括*可选操作*这类抛出异常的方法。

#### iterator(）
AbstractCollection将`iterator()`的实现交给子类，这很正常，不同的子类将可能返回不同的`iterator`。`iterator()`是AbstractCollection访问和操作元素的唯一方式，所以它在很多方法中都会被用到。

**contains()**

`contains()`方法就是通过`iterator()`获取集合的迭代器，之后进行遍历比较，对，就是这么简单粗暴：

```java
    public boolean contains(Object o) {
        Iterator<E> it = iterator();
        if (o==null) {
            while (it.hasNext())
                if (it.next()==null)
                    return true;
        } else {
            while (it.hasNext())
                if (o.equals(it.next()))
                    return true;
        }
        return false;
    }
```

对于特殊结构和搜索需求的大数据量的集合子类，我们可以`override`这个方法，提供更加的快速的查找方法。比如，针对排序的集合，我们可以用二分法进行元素的查找。

值得学习的是，Collection是允许null作为元素存在的，我们在使用和扩展中应该注意到这一点，增加对null特殊情况的判断。

当然，`containAll`方法也跟预想中的简单：

```java
    public boolean containsAll(Collection<?> c) {
        for (Object e : c)
            if (!contains(e))
                return false;
        return true;
    }
```
这种查找方式是比较低效的，复杂度是O(nlogn)。

**remove()**

类似`contain()`，`remove()`也依赖于交给子类实现的`iterator()`：

```java
public boolean remove(Object o) {
        Iterator<E> it = iterator();
        if (o==null) {
            while (it.hasNext()) {
                if (it.next()==null) {
                    it.remove();
                    return true;
                }
            }
        } else {
            while (it.hasNext()) {
                if (o.equals(it.next())) {
                    it.remove();
                    return true;
                }
            }
        }
        return false;
    }
```

`removeAll`、`retainAll`、`clear`乃至Collection接口新增的default方法`removeIf`，都是通过iterator遍历以及移除元素，将具体的操作交给子类提供的iterator执行。

在`remove`的源码中，我们可以发现，Collection确实没有针对线程安全做额外的操作，以保证执行速度。我们也应该牢记，Collection框架不是线程安全的，对于多线程的情况，应该用`java.util.concurrent`包。

#### toArray

看到上面几个函数的实现，是不是觉得很简单呢？接下来，让我们自己来设计`Object[] toArray()`这个函数吧。

> `Object[] toArray()`：返回一个包含此集合中所有元素的数组

Collection无序、允许NULL，允许重复元素，所以基本思路大概就是，定义一个数组，然后遍历集合元素，一个个`set`到数组中：

```java
    public Object[] toArray() {
        Object[] r = new Object[size()];
        Iterator<E> it = iterator();
        for (int i = 0; i < r.length; i++) {
            r[i] = it.next();
        }
       return r;
    }
```

类似上文，我们用iterator进行元素遍历，iterator并不能获取得到元素数目，所以我们用`size()`获取元素数目用以定义数组大小。`size()`也是一个抽象方法，交给子类实现。

**`size()`真的可靠吗？**`size()`函数是由子类实现的，所以我们并不清楚`size()`返回的是否就是真实的元素数目（虽然这个可能性比较小，但是有可能返回的数比集合内的数目要大或者小）。为了让我们的函数有更好的容错性，让我们把这种情况考虑进来吧。

首先看，`size() < realSize`的情况，对于这种情况，在for循环中，it.next()会因到达最后一个节点而报错。`it.next()`应该和`it.hasNext()`搭配使用：

```java
    public Object[] toArray() {
        // Estimate size of array; be prepared to see  fewer elements
        Object[] r = new Object[size()];
        Iterator<E> it = iterator();
        for (int i = 0; i < r.length; i++) {
            if (! it.hasNext()) // fewer elements than expected
                return Arrays.copyOf(r, i);
            r[i] = it.next();
        }
        return r;
    }
```

当`it.hasNext()`返回fasle时，集合内的元素都遍历过了，这时我们应该终止循环，将数组元素拷贝到一个大小刚好的数组中返回。

> `Arrays.copyOf()` Arrays提供的静态拷贝函数，其实现是通过System.arraycopy()调用native函数实现拷贝，所以在效率上要好很多。

`size() < realSize`的情况就比较复杂了，因为我们不清楚集合内元素的具体数目，可能刚好比`size()`大1，也可能是`size()`大很多，所以我们需要动态扩容，java源码给出的扩容方式是这样的：`newCap = cap + (cap >> 1) + 1;`。举个例子，假设原来的数组大小cap==8，一次扩容之后就是（8+4+1 = 13），第二次扩容之后就是（13+6+1 = 20）。

Java数组的length是有限制的，必须是非负的int，所以它的理论最大值就是java.lang.Integer.MAX_VALUE = 2^31-1 = 2147483647，我们不可以无限地扩容数组大小：

```java
....
  private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
  if (newCap - MAX_ARRAY_SIZE > 0)   newCap = hugeCapacity(cap + 1);
....

  private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError
                ("Required array size too large");
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
```

关于MAX_ARRAY_SIZE，官方文档是这么说的*Some VMs reserve some header words in an array*，一些jvm可能会在数组中保存一些标题字，占用数组大小，所以我们不能把数组定到最大，这样可能会报错。

最后看一下整体实现：
```
public Object[] toArray() {
        // Estimate size of array; be prepared to see more or fewer elements
        Object[] r = new Object[size()];
        Iterator<E> it = iterator();
        for (int i = 0; i < r.length; i++) {
            if (! it.hasNext()) // fewer elements than expected
                return Arrays.copyOf(r, i);
            r[i] = it.next();
        }
        return it.hasNext() ? finishToArray(r, it) : r;
    }

@SuppressWarnings("unchecked")
    private static <T> T[] finishToArray(T[] r, Iterator<?> it) {
        int i = r.length;
        while (it.hasNext()) {
            int cap = r.length;
            if (i == cap) {
                int newCap = cap + (cap >> 1) + 1;
                // overflow-conscious code
                if (newCap - MAX_ARRAY_SIZE > 0)
                    newCap = hugeCapacity(cap + 1);
                r = Arrays.copyOf(r, newCap);
            }
            r[i++] = (T)it.next();
        }
        // trim if overallocated
        return (i == r.length) ? r : Arrays.copyOf(r, i);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError
                ("Required array size too large");
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }

```

### 总结

Collection接口定义了集合基本的操作，包括添加、删除、判断是否有元素、清空等，在java8中新增了Stream支持，增强Collection的能力。AbstractCollection中的实现不多，而且都比较简单。在下篇文章，我将开始讲集合框架的LIst部分，欢迎关注。

### 参考
- [java8SE文档](https://docs.oracle.com/javase/8/docs/api/java/util/package-summary.html)
- java 8 源码



