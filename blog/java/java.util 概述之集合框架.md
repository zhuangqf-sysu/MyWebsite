*本文首发于本人博客 [lovefadai.xyz](http://www.lovefadai.xyz)：[java.util概述]() 欢迎访问，转载请注明来源。*

> Package java.util
Contains the collections framework, legacy collection classes, event model, date and time facilities, internationalization, and miscellaneous utility classes (a string tokenizer, a random-number generator, and a bit array).

java.util是java语言的一个重要部分，其内容除了我们熟知的集合框架及其实现类外，还定义了事件模型，日期时间工具类，国际化和其他实用程序类（字符串标记器，随机数生成器和位数组）。

现在，让我们具体看看这个包下面都有哪些接口和类，都能为我们提供哪些功能。

### Collection 集合框架

*Java中的集合分为两大类，一类继承自Collection接口，包括List、Set、Queue等三种数据结构，一类是继承自Map接口的映射集合类。*

Collection集合框架给我们展示了一种理想的类型框架实现方案：
- 1、用接口定义类型
接口和类都可以用于定义类型。相比于具体的实现类，接口和抽象类不必纠结于实现，只需要定义好类型的行为（抽象方法）；而Java是单继承的，所以接口比抽象类在定义类型中具备了更大的灵活性。
Collection接口定义了容器的基本使用功能——存取数据。Set、Queue、List是Collection的子接口，分别代表了三种常用的数据结构——不包含重复元素的集合，先进先出的队列，有序的数组。
![Interface.png](http://upload-images.jianshu.io/upload_images/4215078-b397ff458af0fd5b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 2、用抽象类继承接口，完成基本的实现
接口在定义类型上有其优势，但是接口不能包含实现。而对于集合这一类型，即使有再多分类，其实现也会有一些共同之处。用抽象类继承接口，可以接管其实现功能,又不破坏接口带来的继承灵活性。其优点在《Effective Java》中有所提及：
> 通过对你导出的每个重要接口都提供一个抽象的骨架实现类（AbstractInterface），把接口和抽象类的优点结合起来。接口的作用仍然是定义类型，但是骨架实现类接管了所有与接口实现相关的工作。
![AbstractClass.png](http://upload-images.jianshu.io/upload_images/4215078-4007408be75bf677.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 3、丰富实现
框架有了，最后就是得在框架中提供几个具体的实现给程序员使用。
![Implement.png](http://upload-images.jianshu.io/upload_images/4215078-6020100e45ff5d46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Map 框架
map是一种提供key-value映射关系的数据结构。相比于Collection，Map框架结构简单很多，但是其实现类却丰富得多，实现也各有千秋，复杂了很多。
![Map.png](http://upload-images.jianshu.io/upload_images/4215078-2ecc56ea3ee3a77f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Map的实现类比较常用的有四个：**Hashtable**、**HashMap**、**TreeMap**、**LinkedHashMap**
- Hashtable：基于哈希表+链表
Hashtable事实上是java 1.0的一个遗留类，在java 1.2重构，实现了Map接口，归纳到了Java集合框架中。不同于java.util包中的其他集合类，hashtable是线程安全的，但是并不推荐在开发中使用这个类，请在单线程中使用HashMap，在多线程中使用ConcurrentHashMap。
- HashMap：基于哈希表+链表+红黑树
在java 1.8中，HashMap得到了重构，在哈希表+链表的实现上增加了红黑树，以应对hash冲突带来的性能退化。
- TreeMap：基于红黑树
TreeMap实现SortedMap接口，能够把它保存的记录根据键排序，默认是按键值的升序排序，也可以指定排序的比较器，当用Iterator遍历TreeMap时，得到的记录是排过序的。
- LinkedHashMap：基于哈希表+链表
LinkedHashMap是HashMap的一个子类，保存了记录的插入顺序，在用Iterator遍历LinkedHashMap时，先得到的记录肯定是先插入的，也可以在构造时带参数，按照访问次序排序。LinkedHashMap在节点上增加了两个指针（before、after），在HashMap实现的哈希表（数组）基础上，将节点串成一个双向链表，以保存节点的插入顺序。同时，在遍历上，LinkedhashMap要比HashMap要快，因为HashMap需要遍历整个哈希表（可能是非常大且稀疏的数组），而LinkedHashMap则可以通过双向链表进行遍历。

哈希表的搜索复杂度是O(1)，链表的搜索复杂度是O(n)，红黑树（平衡树）的搜索复杂度是O(log n)。Hashtable是基于哈希表实现的，哈希表受限于数组大小、哈希函数的实现、数据量的增长往往会面临hash冲突的风险。Hashtable和少量数据的HashMap在应对hash冲突上采用了拉链法，即在冲突的域上用链表将节点串连起来。当冲突达到一定规模，会将原本O(1)的搜索复杂度提升到O(n)。所以HashMap的重构，在应对hash冲突上，对搜索效率的提升是有很大帮助的。

### Iterator 框架
Iterator并不是一个集合接口，然而对于Java Collection Framework来说确实一个非常重要的部分——它是Collection接口的父接口，为Collection和Map（keySet、valueSet）提供了迭代遍历的功能定义，是一个功能性接口。

在java 1.2之前，java集合框架的遍历功能由[`Enumeration`](https://docs.oracle.com/javase/8/docs/api/java/util/Enumeration.html "interface in java.util")提供，在Hashtable和Vector中，我们还能看到它的影子。相比于Enumeration，Iterator在方法命名上更简单（`hasMoreElements()`->`hasNext()`、`nextElement()`->`next()`），而且增加了`remove()`方法，支持在底层集合中删除Iterator当前所指的对象。在java 1.8中，Iterator增加了`forEachRemaining()`，支持以Lambda表达式的形式遍历集合。
![Iterator.png](http://upload-images.jianshu.io/upload_images/4215078-f96b5399c514fb3a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
作为一个功能接口，集合类都需要直接或间接实现这个Iterator接口已提供遍历功能。但是作为迭代功能的接口却很少，在java 1.2中有一个ListIterator，正对List的操作，增加了`add()`、`set()`、`nextIndex()`、`hasPrevious()`、`previous()`、`previousIndex()`方法；在java 1.8中，增加了PrimitiveIterator作为基本类型的专属迭代器，减少不必要的 boxing、unboxing 开销。

### Collections
java.util还提供了Collections工具类帮助我们处理集合。
Collections是一个非常强大的工具类，针对集合操作提供了大量方法，合理地利用这个类处理集合问题可以有效地提高我们的工作效率。
具体方法请参看[Collections官方文档](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html)




### 参考
- [java8SE文档](https://docs.oracle.com/javase/8/docs/api/java/util/package-summary.html)
- Effective Java