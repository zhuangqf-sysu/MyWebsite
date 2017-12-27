*文接 [深入学习 Spring Boot：Spring Boot启动分析（上）](http://www.jianshu.com/p/c3423be45eb4)*

----
### 2、启动 Spring 应用程序`run()`
Spring Boot首先帮我们实例化了一个SpringApplication对象，接下类调用这个对象的run方法，创建和刷新一个新的ApplicationContext
```
public ConfigurableApplicationContext run(String... args) {
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    ConfigurableApplicationContext context = null;
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
    configureHeadlessProperty();
    SpringApplicationRunListeners listeners = getRunListeners(args);
    listeners.starting();
    try {
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(
                args);
        ConfigurableEnvironment environment = prepareEnvironment(listeners,
                applicationArguments);
        configureIgnoreBeanInfo(environment);
        Banner printedBanner = printBanner(environment);
        context = createApplicationContext();
        exceptionReporters = getSpringFactoriesInstances(
                SpringBootExceptionReporter.class,
                new Class[] { ConfigurableApplicationContext.class }, context);
        prepareContext(context, environment, listeners, applicationArguments,
                printedBanner);
        refreshContext(context);
        afterRefresh(context, applicationArguments);
        listeners.finished(context, null);
        stopWatch.stop();
        if (this.logStartupInfo) {
            new StartupInfoLogger(this.mainApplicationClass)
                    .logStarted(getApplicationLog(), stopWatch);
        }
        return context;
    }
    catch (Throwable ex) {
        handleRunFailure(context, listeners, exceptionReporters, ex);
        throw new IllegalStateException(ex);
    }
}
```
- 2.1 启动一个StopWatch测量程序的运行时间。**StopWatch可以在开发和调试阶段验证程序的性能**

- 2.2 使用Headless模式：
```
System.setProperty("java.awt.headless",System.getProperty("java.awt.headless", true);
```
Headless模式是系统的一种配置模式。在该模式下，系统缺少了显示设备、键盘或鼠标。Spring Boot程序一般是服务端程序，服务器往往缺少前述硬件，但又需要使用他们提供的功能，生成相应的数据，以提供给客户端（比如在console生成spring神兽，绘制验证码之类的）。此时，我们可以**在程序开始激活headless模式**，告诉程序，现在你要工作在Headless mode下，就不要指望硬件帮忙了，你得自力更生，依靠系统的计算能力模拟出这些特性来。

- 2.3 通过SpringFactoriesLoader加载[SpringApplicationRunListener
](https://docs.spring.io/spring-boot/docs/2.0.0.M3/api/org/springframework/boot/SpringApplicationRunListener.html)并启动，用以监听SpringApplication的run方法产生的各类事件。SpringApplicationRunListeners是对SpringApplicationRunListener实例集合的一个封装。在这里，SpringApplication只加载了一个Listener：` EventPublishingRunListener`，事实上这个类是充当着事件广播器的作用，它可以将run方法中的事件（如starting、environmentPrepared）封装为Event对象，发布到我们之前加载的ApplicationListener中。

- 2.4 创建和配置ConfigurableEnvironment：
```
private ConfigurableEnvironment prepareEnvironment(
        SpringApplicationRunListeners listeners,
        ApplicationArguments applicationArguments) {
    // Create and configure the environment
    ConfigurableEnvironment environment = getOrCreateEnvironment();
    configureEnvironment(environment, applicationArguments.getSourceArgs());
    listeners.environmentPrepared(environment);
    bindToSpringApplication(environment);
    if (this.webApplicationType == WebApplicationType.NONE) {
        environment = new EnvironmentConverter(getClassLoader())
                .convertToStandardEnvironmentIfNecessary(environment);
    }
    ConfigurationPropertySources.attach(environment);
    return environment;
}
```
a、根据我们之前检测出来的`webApplicationType`创建一个ConfigurableEnvironment对象（若`this.webApplicationType == WebApplicationType.SERVLET`则创建其子类StandardServletEnvironment()对象，否则创建StandardEnvironment对象）。在实例化一个ConfigurableEnvironment对象时，程序会读取运行环境的各种数据，如"java.vm.version" -> "25.73-b02"；
b、将我们在启动应用程序时带入的参数（如“--debug”），配置到ConfigurableEnvironment对象中；
c、调用`listeners.environmentPrepared(environment)`，发布事件。在这里，`EventPublishingRunListener`会封装一个`ApplicationEnvironmentPreparedEvent`，然后发布到各个Listener中。Listener执行的动作我们暂时不分析，明显可以看到的就是在debug模式下，console会打印第一行日志，显示应用程序的运行环境；
d、将environment绑定到SpringApplication上
e、在environment.propertySources中添加（如果没有的话）一个`ConfigurationPropertySourcesPropertySource`对象，使得environment管理的PropertySource对象能适配 PropertySourcesPropertyResolver，能够通过属性名get到具体的配置，详细见 [ConfigurationPropertySources
](https://docs.spring.io/spring-boot/docs/2.0.0.M3/api/org/springframework/boot/context/properties/source/ConfigurationPropertySource.html)

- 2.5 将系统属性“spring.beaninfo.ignore”设置为true，跳过扫描BeanInfo类，防止重复加载bean。详见[IGNORE_BEANINFO_PROPERTY_NAME](https://docs.spring.io/spring/docs/5.0.0.RC3/javadoc-api/org/springframework/beans/CachedIntrospectionResults.html#IGNORE_BEANINFO_PROPERTY_NAME)

- 2.6 调用`printBanner`打印“Spring神兽”

- 2.7 根据webApplicationType创建一个ConfigurableApplicationContext对象。在本例中，webApplicationType为”SERVLET“，创建的对象为"org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext"

- 2.8 加载spring.factories中的SpringBootExceptionReporter实现类

- 2.9 准备Context：
```
private void prepareContext(ConfigurableApplicationContext context,
                            ConfigurableEnvironment environment, SpringApplicationRunListeners listeners,
                            ApplicationArguments applicationArguments, Banner printedBanner) {
    context.setEnvironment(environment);
    postProcessApplicationContext(context);
    applyInitializers(context);
    listeners.contextPrepared(context);
    if (this.logStartupInfo) {
        logStartupInfo(context.getParent() == null);
        logStartupProfileInfo(context);
    }

    // Add boot specific singleton beans
    context.getBeanFactory().registerSingleton("springApplicationArguments",
            applicationArguments);
    if (printedBanner != null) {
        context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);
    }

    // Load the sources
    Set<Object> sources = getAllSources();
    Assert.notEmpty(sources, "Sources must not be empty");
    load(context, sources.toArray(new Object[sources.size()]));
    listeners.contextLoaded(context);
}
```
a、`setEnvironment(environment)` 
b、`postProcessApplicationContext(context)`，做一些善后工作：如果成员变量beanNameGenerator不为Null，那么为ApplicationContext对象注册beanNameGenerator bean；如果成员变量resourceLoader不为null，则为ApplicationContext对象设置ResourceLoader。
```
protected void postProcessApplicationContext(ConfigurableApplicationContext context) {
    if (this.beanNameGenerator != null) {
        context.getBeanFactory().registerSingleton(
                AnnotationConfigUtils.CONFIGURATION_BEAN_NAME_GENERATOR,
                this.beanNameGenerator);
    }
    if (this.resourceLoader != null) {
        if (context instanceof GenericApplicationContext) {
            ((GenericApplicationContext) context)
                    .setResourceLoader(this.resourceLoader);
        }
        if (context instanceof DefaultResourceLoader) {
            ((DefaultResourceLoader) context)
                    .setClassLoader(this.resourceLoader.getClassLoader());
        }
    }
}
```
c、依次调用SpringApplication的initializers中的初始化器：
```
protected void applyInitializers(ConfigurableApplicationContext context) {
    for (ApplicationContextInitializer initializer : getInitializers()) {
        Class<?> requiredType = GenericTypeResolver.resolveTypeArgument(
                initializer.getClass(), ApplicationContextInitializer.class);
        Assert.isInstanceOf(requiredType, context, "Unable to call initializer.");
        initializer.initialize(context);
    }
}
```
在本例中，initializers列表及其任务为：
```
initializers = {ArrayList@952}  size = 6
// 读取key为”context.initializer.classes“的配置，实例化Initializer并执行initialize();
 0 = {DelegatingApplicationContextInitializer@1057} 
// 设置context的id，本例等于”application“；
 1 = {ContextIdApplicationContextInitializer@1058} 
// 为context.beanFactoryPostProcessor增加一个ConfigurationWarningsPostProcessor对象，报告warning等级的错误配置
2 = {ConfigurationWarningsApplicationContextInitializer@1059} 
// 为context添加一个ApplicationListener，监听WebServerInitializedEvent
 3 = {ServerPortInfoApplicationContextInitializer@1060} 
// 为context.beanFactoryPostProcessor增加一个CachingMetadataReaderFactoryPostProcessor
 4 = {SharedMetadataReaderFactoryContextInitializer@1061} 
//为context添加一个AutoConfigurationReportListener，用以监听自动配置报告
 5 = {AutoConfigurationReportLoggingInitializer@1062} 
```
d、调用监听器，报告contextPrepared事件；
e、打印启动日志：
```
2017-09-10 20:18:51.937  INFO 28314 --- [           main] com.zhuangqf.learn.App                   : Starting App on zhuangqinfa with PID 28314 (/home/zhuangqf/workspace/spring/SpringBootDemo/target/classes started by zhuangqf in /home/zhuangqf/workspace/spring/SpringBootDemo)
2017-09-10 20:18:51.939  INFO 28314 --- [           main] com.zhuangqf.learn.App                   : No active profile set, falling back to default profiles: default
```
f、注册指定的bean："springApplicationArguments"和"springBootBanner"：
```
// Add boot specific singleton beans
context.getBeanFactory().registerSingleton("springApplicationArguments", applicationArguments);
if (printedBanner != null) {
    context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);
}
```
简单而言， context的beanFactory是一个[DefaultListableBeanFactory](https://docs.spring.io/spring/docs/5.0.0.RC4/javadoc-api/org/springframework/beans/factory/support/DefaultListableBeanFactory.html)对象，其内部有多个Map<String, Object> 用来存放注册的bean。
g、加载context.primarySources，在本例中为App.class，其主要是加载App上的注解或默认的配置文件。

- 2.10 refreshContext(context)
加载或刷新持久化形式的配置（如xml文件、properties文件，和数据库信息）。
由于这是一个启动方法, 如果它失败了, 它应该销毁已经创建的单例, 以避免悬空的资源。换言之, 在调用该方法之后, 所有的单例bean都不应实例化。
```
@Override
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // Prepare this context for refreshing.
        prepareRefresh();

        // Tell the subclass to refresh the internal bean factory.
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // Prepare the bean factory for use in this context.
        prepareBeanFactory(beanFactory);

        try {
            // Allows post-processing of the bean factory in context subclasses.
            postProcessBeanFactory(beanFactory);

            // Invoke factory processors registered as beans in the context.
            invokeBeanFactoryPostProcessors(beanFactory);

            // Register bean processors that intercept bean creation.
            registerBeanPostProcessors(beanFactory);

            // Initialize message source for this context.
            initMessageSource();

            // Initialize event multicaster for this context.
            initApplicationEventMulticaster();

            // Initialize other special beans in specific context subclasses.
            onRefresh();

            // Check for listener beans and register them.
            registerListeners();

            // Instantiate all remaining (non-lazy-init) singletons.
            finishBeanFactoryInitialization(beanFactory);

            // Last step: publish corresponding event.
            finishRefresh();
        }

        catch (BeansException ex) {
            if (logger.isWarnEnabled()) {
                logger.warn("Exception encountered during context initialization - " +
                        "cancelling refresh attempt: " + ex);
            }

            // Destroy already created singletons to avoid dangling resources.
            destroyBeans();

            // Reset 'active' flag.
            cancelRefresh(ex);

            // Propagate exception to caller.
            throw ex;
        }

        finally {
            // Reset common introspection caches in Spring's core, since we
            // might not ever need metadata for singleton beans anymore...
            resetCommonCaches();
        }
    }
}
```
整个方法比较复杂，我们一点点解析：
a、准备刷新`prepareRefresh()`，完成了以下任务：
设置context的startupDate为当前时间；
设置closed标志位为false，active标志为true；
读取Property配置到environment中；
检查environment必设的配置是否为null；
初始化`this.earlyApplicationEvents`作为存放发布时间的Set
b、`obtainFreshBeanFactory()` ：销毁原有的beanFactory类，并新建一个beanFactory返回
c、`prepareBeanFactory(beanFactory)`：设置beanFactory的各个属性，由[AbstractApplicationContext](https://docs.spring.io/spring/docs/5.0.0.RC4/javadoc-api/org/springframework/context/support/AbstractApplicationContext.html)实现；
d、`postProcessBeanFactory(beanFactory)`：对beanFactory根据具体的Context子类设置不同的属性，例如，本例中context的具体类型为[ServletWebServerApplicationContext](https://docs.spring.io/spring-boot/docs/2.0.0.M3/api/org/springframework/boot/web/servlet/context/ServletWebServerApplicationContext.html)，会在beanFactory中注册一个ServletContextAwareProcessor。
e、`invokeBeanFactoryPostProcessors(beanFactory);`调用注册到beanFactory中的postRrocessors。