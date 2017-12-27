### 前言

*Spring Boot早就接触了，浏览了一遍官方文档，写过几个小Demo，但是对于其源码、底层实现不了解，现在终于有时间看看源码，学习学习了。本专题不定期更新，希望各位大佬不吝赐教\^@\^*

> 学习工具：
idea 或 eclipse
[Spring Boot 官方文档](https://docs.spring.io/spring-boot/docs/2.0.0.M3/reference/htmlsingle/)
[Spring Boot API](https://docs.spring.io/spring-boot/docs/2.0.0.M3/api/)
[Spring API](https://docs.spring.io/spring/docs/5.0.0.RC3/javadoc-api/)

### 0、搭建一个简单的Spring Boot web程序

要想知道程序是怎么运行的，不跑跑程序怎么知道呢？而且在IDEA等开发工具可以帮助我们更好的阅读源码。我们先按照[官方文档](https://docs.spring.io/spring-boot/docs/2.0.0.M3/reference/htmlsingle/)的指导，在idea上搭建一个简单的Spring Boot web应用程序：
 
#### a、新建maven项目，引入spring boot经典pom：
```
 <!-- Inherit defaults from Spring Boot -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.0.M3</version>
    </parent>

    <!-- Add typical dependencies for a web application -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <!-- Package as an executable jar -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

    <!-- (you don't need this if you are using a .RELEASE version) -->
    <repositories>
        <repository>
            <id>spring-snapshots</id>
            <url>http://repo.spring.io/snapshot</url>
            <snapshots><enabled>true</enabled></snapshots>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <url>http://repo.spring.io/milestone</url>
        </repository>
    </repositories>
    <pluginRepositories>
        <pluginRepository>
            <id>spring-snapshots</id>
            <url>http://repo.spring.io/snapshot</url>
        </pluginRepository>
        <pluginRepository>
            <id>spring-milestones</id>
            <url>http://repo.spring.io/milestone</url>
        </pluginRepository>
    </pluginRepositories>
```
####  b、编写入口程序：
```
package com.zhuangqf.learn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

/**
 * Created by zhuangqf on 9/3/17.
 */
@EnableAutoConfiguration
public class App {
    public static void main(String[] args) throws Exception {
        SpringApplication.run(App.class, args);
    }
}
```
为了分析方便，我们删去了@RestController的注解。在后续的文章中，我还会就@RestController等注解做专门分析。

#### c、运行程序：
运行spring程序，可以直接运行App启动类的main函数，也可以在命令行上用maven运行：`mvn	spring-boot:run`。idea对Spring十分友好，我们可以点左上角的`Edit Configuration`编辑我们的启动按钮，*记得勾选Enable Debug Output*：
![Edit Configuration](http://upload-images.jianshu.io/upload_images/4215078-49948755a9306b86.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

配置完成后点击run，console会有五彩斑斓的日志打印出来：
```
2017-09-03 16:59:27.946 DEBUG 10926 --- [           main] .c.l.ClasspathLoggingApplicationListener : Application started with classpath: [file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/charsets.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/deploy.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/cldrdata.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/dnsns.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/jaccess.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/jfxrt.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/localedata.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/nashorn.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/sunec.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/sunjce_provider.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/sunpkcs11.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/ext/zipfs.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/javaws.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/jce.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/jfr.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/jfxswt.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/jsse.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/management-agent.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/plugin.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/resources.jar, file:/usr/lib/jvm/jdk1.8.0_73/jre/lib/rt.jar, file:/home/zhuangqf/workspace/spring/SpringBootDemo/target/classes/, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot-starter-web/2.0.0.M3/spring-boot-starter-web-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot-starter/2.0.0.M3/spring-boot-starter-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot/2.0.0.M3/spring-boot-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot-autoconfigure/2.0.0.M3/spring-boot-autoconfigure-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot-starter-logging/2.0.0.M3/spring-boot-starter-logging-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/ch/qos/logback/logback-classic/1.2.3/logback-classic-1.2.3.jar, file:/home/zhuangqf/.m2/repository/ch/qos/logback/logback-core/1.2.3/logback-core-1.2.3.jar, file:/home/zhuangqf/.m2/repository/org/slf4j/slf4j-api/1.7.25/slf4j-api-1.7.25.jar, file:/home/zhuangqf/.m2/repository/org/slf4j/jul-to-slf4j/1.7.25/jul-to-slf4j-1.7.25.jar, file:/home/zhuangqf/.m2/repository/org/slf4j/log4j-over-slf4j/1.7.25/log4j-over-slf4j-1.7.25.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-core/5.0.0.RC3/spring-core-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-jcl/5.0.0.RC3/spring-jcl-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/yaml/snakeyaml/1.18/snakeyaml-1.18.jar, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot-starter-json/2.0.0.M3/spring-boot-starter-json-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.9.0.pr4/jackson-databind-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/core/jackson-annotations/2.9.0.pr4/jackson-annotations-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.9.0.pr4/jackson-core-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jdk8/2.9.0.pr4/jackson-datatype-jdk8-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jsr310/2.9.0.pr4/jackson-datatype-jsr310-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/module/jackson-module-parameter-names/2.9.0.pr4/jackson-module-parameter-names-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/jackson/module/jackson-module-kotlin/2.9.0.pr4/jackson-module-kotlin-2.9.0.pr4.jar, file:/home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot-starter-tomcat/2.0.0.M3/spring-boot-starter-tomcat-2.0.0.M3.jar, file:/home/zhuangqf/.m2/repository/org/apache/tomcat/embed/tomcat-embed-core/8.5.16/tomcat-embed-core-8.5.16.jar, file:/home/zhuangqf/.m2/repository/org/apache/tomcat/embed/tomcat-embed-el/8.5.16/tomcat-embed-el-8.5.16.jar, file:/home/zhuangqf/.m2/repository/org/apache/tomcat/embed/tomcat-embed-websocket/8.5.16/tomcat-embed-websocket-8.5.16.jar, file:/home/zhuangqf/.m2/repository/org/hibernate/hibernate-validator/5.4.1.Final/hibernate-validator-5.4.1.Final.jar, file:/home/zhuangqf/.m2/repository/javax/validation/validation-api/1.1.0.Final/validation-api-1.1.0.Final.jar, file:/home/zhuangqf/.m2/repository/org/jboss/logging/jboss-logging/3.3.1.Final/jboss-logging-3.3.1.Final.jar, file:/home/zhuangqf/.m2/repository/com/fasterxml/classmate/1.3.3/classmate-1.3.3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-web/5.0.0.RC3/spring-web-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-beans/5.0.0.RC3/spring-beans-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-webmvc/5.0.0.RC3/spring-webmvc-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-aop/5.0.0.RC3/spring-aop-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-context/5.0.0.RC3/spring-context-5.0.0.RC3.jar, file:/home/zhuangqf/.m2/repository/org/springframework/spring-expression/5.0.0.RC3/spring-expression-5.0.0.RC3.jar, file:/home/zhuangqf/software/idea/lib/idea_rt.jar]

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::             (v2.0.0.M3)

2017-09-03 16:59:28.202  INFO 10926 --- [           main] com.zhuangqf.learn.App                   : Starting App on zhuangqinfa with PID 10926 (/home/zhuangqf/workspace/spring/SpringBootDemo/target/classes started by zhuangqf in /home/zhuangqf/workspace/spring/SpringBootDemo)
2017-09-03 16:59:28.204  INFO 10926 --- [           main] com.zhuangqf.learn.App                   : No active profile set, falling back to default profiles: default
2017-09-03 16:59:28.204 DEBUG 10926 --- [           main] o.s.boot.SpringApplication               : Loading source class com.zhuangqf.learn.App
2017-09-03 16:59:28.253  INFO 10926 --- [           main] ConfigServletWebServerApplicationContext : Refreshing org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@54c562f7: startup date [Sun Sep 03 16:59:28 CST 2017]; root of context hierarchy
2017-09-03 16:59:28.258 DEBUG 10926 --- [           main] ConfigServletWebServerApplicationContext : Bean factory for org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@54c562f7: org.springframework.beans.factory.support.DefaultListableBeanFactory@43bc63a3: defining beans [org.springframework.context.annotation.internalConfigurationAnnotationProcessor,org.springframework.context.annotation.internalAutowiredAnnotationProcessor,org.springframework.context.annotation.internalRequiredAnnotationProcessor,org.springframework.context.annotation.internalCommonAnnotationProcessor,org.springframework.context.event.internalEventListenerProcessor,org.springframework.context.event.internalEventListenerFactory,app]; root of factory hierarchy
2017-09-03 16:59:30.034 DEBUG 10926 --- [           main] ConfigServletWebServerApplicationContext : Unable to locate MessageSource with name 'messageSource': using default [org.springframework.context.support.DelegatingMessageSource@ccb4b1b]
2017-09-03 16:59:30.034 DEBUG 10926 --- [           main] ConfigServletWebServerApplicationContext : Unable to locate ApplicationEventMulticaster with name 'applicationEventMulticaster': using default [org.springframework.context.event.SimpleApplicationEventMulticaster@4097cac]
2017-09-03 16:59:30.581 DEBUG 10926 --- [           main] .s.b.w.e.t.TomcatServletWebServerFactory : Code archive: /home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot/2.0.0.M3/spring-boot-2.0.0.M3.jar
2017-09-03 16:59:30.582 DEBUG 10926 --- [           main] .s.b.w.e.t.TomcatServletWebServerFactory : Code archive: /home/zhuangqf/.m2/repository/org/springframework/boot/spring-boot/2.0.0.M3/spring-boot-2.0.0.M3.jar
2017-09-03 16:59:30.582 DEBUG 10926 --- [           main] .s.b.w.e.t.TomcatServletWebServerFactory : None of the document roots [src/main/webapp, public, static] point to a directory and will be ignored.
2017-09-03 16:59:30.651  INFO 10926 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2017-09-03 16:59:30.680  INFO 10926 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2017-09-03 16:59:30.681  INFO 10926 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/8.5.16
2017-09-03 16:59:30.882  INFO 10926 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2017-09-03 16:59:30.882  INFO 10926 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 2633 ms
2017-09-03 16:59:31.039 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.ServletContextInitializerBeans : Added existing Servlet initializer bean 'dispatcherServletRegistration'; order=2147483647, resource=class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration.class]
2017-09-03 16:59:31.111 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.ServletContextInitializerBeans : Created Filter initializer for bean 'characterEncodingFilter'; order=-2147483648, resource=class path resource [org/springframework/boot/autoconfigure/web/servlet/HttpEncodingAutoConfiguration.class]
2017-09-03 16:59:31.111 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.ServletContextInitializerBeans : Created Filter initializer for bean 'hiddenHttpMethodFilter'; order=-10000, resource=class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.class]
2017-09-03 16:59:31.111 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.ServletContextInitializerBeans : Created Filter initializer for bean 'httpPutFormContentFilter'; order=-9900, resource=class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.class]
2017-09-03 16:59:31.111 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.ServletContextInitializerBeans : Created Filter initializer for bean 'requestContextFilter'; order=-105, resource=class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class]
2017-09-03 16:59:31.115  INFO 10926 --- [ost-startStop-1] o.s.b.w.servlet.ServletRegistrationBean  : Mapping servlet: 'dispatcherServlet' to [/]
2017-09-03 16:59:31.121  INFO 10926 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'characterEncodingFilter' to: [/*]
2017-09-03 16:59:31.122  INFO 10926 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'hiddenHttpMethodFilter' to: [/*]
2017-09-03 16:59:31.122  INFO 10926 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'httpPutFormContentFilter' to: [/*]
2017-09-03 16:59:31.122  INFO 10926 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'requestContextFilter' to: [/*]
2017-09-03 16:59:31.146 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.f.OrderedRequestContextFilter  : Initializing filter 'requestContextFilter'
2017-09-03 16:59:31.147 DEBUG 10926 --- [ost-startStop-1] o.s.b.w.s.f.OrderedRequestContextFilter  : Filter 'requestContextFilter' configured successfully
2017-09-03 16:59:31.148 DEBUG 10926 --- [ost-startStop-1] .b.w.s.f.OrderedHttpPutFormContentFilter : Initializing filter 'httpPutFormContentFilter'
2017-09-03 16:59:31.148 DEBUG 10926 --- [ost-startStop-1] .b.w.s.f.OrderedHttpPutFormContentFilter : Filter 'httpPutFormContentFilter' configured successfully
2017-09-03 16:59:31.148 DEBUG 10926 --- [ost-startStop-1] .s.b.w.s.f.OrderedHiddenHttpMethodFilter : Initializing filter 'hiddenHttpMethodFilter'
2017-09-03 16:59:31.148 DEBUG 10926 --- [ost-startStop-1] .s.b.w.s.f.OrderedHiddenHttpMethodFilter : Filter 'hiddenHttpMethodFilter' configured successfully
2017-09-03 16:59:31.149 DEBUG 10926 --- [ost-startStop-1] s.b.w.s.f.OrderedCharacterEncodingFilter : Initializing filter 'characterEncodingFilter'
2017-09-03 16:59:31.149 DEBUG 10926 --- [ost-startStop-1] s.b.w.s.f.OrderedCharacterEncodingFilter : Filter 'characterEncodingFilter' configured successfully
2017-09-03 16:59:31.672  INFO 10926 --- [           main] s.w.s.m.m.a.RequestMappingHandlerAdapter : Looking for @ControllerAdvice: org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@54c562f7: startup date [Sun Sep 03 16:59:28 CST 2017]; root of context hierarchy
2017-09-03 16:59:31.828  INFO 10926 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error],produces=[text/html]}" onto public org.springframework.web.servlet.ModelAndView org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController.errorHtml(javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse)
2017-09-03 16:59:31.832  INFO 10926 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error]}" onto public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController.error(javax.servlet.http.HttpServletRequest)
2017-09-03 16:59:31.890  INFO 10926 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/webjars/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-09-03 16:59:31.890  INFO 10926 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-09-03 16:59:31.958  INFO 10926 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**/favicon.ico] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-09-03 16:59:32.187  INFO 10926 --- [           main] o.s.j.e.a.AnnotationMBeanExporter        : Registering beans for JMX exposure on startup
2017-09-03 16:59:32.196 DEBUG 10926 --- [           main] ConfigServletWebServerApplicationContext : Unable to locate LifecycleProcessor with name 'lifecycleProcessor': using default [org.springframework.context.support.DefaultLifecycleProcessor@54e7391d]
2017-09-03 16:59:32.226 DEBUG 10926 --- [           main] utoConfigurationReportLoggingInitializer : 


=========================
AUTO-CONFIGURATION REPORT
=========================

// 此处省略自动配置发现报告

2017-09-03 16:59:32.277  INFO 10926 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http)
2017-09-03 16:59:32.283  INFO 10926 --- [           main] com.zhuangqf.learn.App                   : Started App in 4.824 seconds (JVM running for 5.613)

```
----
### 1、从`SpringApplication.run()`出发

SpringApplication的[API介绍](https://docs.spring.io/spring-boot/docs/2.0.0.M3/api/)如下：
> SpringApplication,可用于从 Java main 方法引导和启动 Spring 应用程序。默认将执行以下步骤来引导应用程序:
a、创建适当的 ApplicationContext 实例 (取决于您的类路径)
b、注册 CommandLinePropertySource 以将命令行参数公开为 Spring 属性
c 、刷新应用程序上下文, 加载所有单独的 bean
d、触发任何 CommandLineRunner bean

在整个项目中，我们做的工作十分的简单：
- 为App类添加@EnableAutoConfiguration注解；
- 在main方法中调用`SpringApplication.run(App.class, args)`

然后Spring就帮我们做了大量的工作，最终启动了一个web程序。现在让我们从`SpringApplication.run()`出发看看Spring Boot到底是怎么启动的。
```
public static ConfigurableApplicationContext run(Class<?>[] primarySources,String[] args) {
    return new SpringApplication(primarySources).run(args);
}
```
run方法先将我们的启动类（App）的类名作为参数实例化了一个SpringApplication，然后调用了另一个run方法：`run(args)`。 

SpringApplication构造器：
```
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
	this.resourceLoader = resourceLoader;
	Assert.notNull(primarySources, "PrimarySources must not be null");
	this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
	this.webApplicationType = deduceWebApplicationType();
	setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
	setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
	this.mainApplicationClass = deduceMainApplicationClass();
}
```
其中：
- resourceLoader为null（传入参数）；
- primarySources 里只有一个元素（App.class，传入参数）；-
- deduceWebApplicationType()推断当前环境是哪种Web环境（Servlet、Reactive），或者不是Web环境，判断逻辑为Classpath是够有以下类：
存在`org.springframework.web.reactive.DispatcherHandler`且不存在`org.springframework.web.servlet.DispatcherServlet`为`WebApplicationType.REACTIVE`；
同时存在`javax.servlet.Servlet`、`org.springframework.web.context.ConfigurableWebApplicationContext` 为`WebApplicationType.SERVLET`；
否则为 `WebApplicationType.NONE`
在这里`this.webApplicationType = WebApplicationType.SERVLET`；
- initializers是一个用来存放SpringApplication所需的ApplicationContextInitializer实例的ArrayList，这些实例是用来初始化应用程序的上下文环境的。getSpringFactoriesInstances方法可以根据类型和配置文件 "META-INF/spring.factories"（包括依赖的jar中打包的）加载相应的工厂类，具体见下文。以下是本项目实例化的Initializer：
```
initializers = {ArrayList@952}  size = 6
 0 = {DelegatingApplicationContextInitializer@1057} 
 1 = {ContextIdApplicationContextInitializer@1058} 
 2 = {ConfigurationWarningsApplicationContextInitializer@1059} 
 3 = {ServerPortInfoApplicationContextInitializer@1060} 
 4 = {SharedMetadataReaderFactoryContextInitializer@1061} 
 5 = {AutoConfigurationReportLoggingInitializer@1062} 
```
- 与initializers类似，listeners是一个用来存放监听器的ArrayList，以下是本项目实例化的listeners：
```
listeners = {ArrayList@1055}  size = 10
 0 = {ConfigFileApplicationListener@1067} 
 1 = {AnsiOutputApplicationListener@1068} 
 2 = {LoggingApplicationListener@1069} 
 3 = {ClasspathLoggingApplicationListener@1070} 
 4 = {BackgroundPreinitializer@1071} 
 5 = {DelegatingApplicationListener@1072} 
 6 = {ParentContextCloserApplicationListener@1073} 
 7 = {ClearCachesApplicationListener@1074} 
 8 = {FileEncodingApplicationListener@1075} 
 9 = {LiquibaseServiceLocatorApplicationListener@1076} 
```
- deduceMainApplicationClass()推断当前的应用程序的入口类，即我们的App.class。你可能要问，我们在一开始调用`SpringApplication.run()`的时候不是将App.class作为参数传入SpringApplication了吗？事实上，我们可以将多个Class作为数组参数传入SpringApplication，记住primarySources是一个Set。deduceMainApplicationClass会遍历线程的执行栈`new RuntimeException().getStackTrace()`，找到第一个具有公共main方法的类，并将其返回。在这里`mainApplicationClass = App.class`

至此，SpringBoot帮我们实例化了一个SpringApplication实例，初始化了以下成员变量：
- `ResourceLoader resourceLoader`
- `Set<Class<?>> primarySources`
- `WebApplicationType webApplicationType`
- `List<ApplicationContextInitializer<?>> initializers`
- `List<ApplicationListener<?>> listeners`

接着调用该实例的`run()`，启动 Spring 应用程序。

----
### 1.1 从spring.factories中加载类的机制
在继续探究run方法之前，我们先来看一下遗留问题：getSpringFactoriesInstances方法。
在SpringApplication的初始化中，程序通过这个方法从classpath下的META-INF/spring.factories加载了ApplicationContextInitializer和ApplicationListener接口的多个实现类。以下是源码：
```
private <T> Collection<T> getSpringFactoriesInstances(Class<T> type, Class<?>[] parameterTypes, Object... args) {
	ClassLoader classLoader Thread.currentThread().getContextClassLoader();
	// Use names and ensure unique to protect against duplicates
	Set<String> names = new LinkedHashSet<>(SpringFactoriesLoader.loadFactoryNames(type, classLoader));
	List<T> instances = createSpringFactoriesInstances(type, parameterTypes,classLoader, args, names);
	AnnotationAwareOrderComparator.sort(instances);
	return instances;
}
```
代码很清晰：
- 加载spring.factories，以type为key读取相应的值；
- 实例化读取到的值；
- 将实例排序并返回

#### SpringFactoriesLoader
SpringFactoriesLoader是Spring内部用来加载spring.factories配置文件的静态类。这些文件可以是我们项目新建的，也可以是依赖的jar包下打包引入的。

> spring.factories是Spring项目的配置文件之一，位于META-INF目录下。其必须是 [Properties](https://docs.oracle.com/javase/8/docs/api/java/util/Properties.html?is-external=true) 格式，即Key-Value格式。同时要求，key必须为接口或抽象类的完全限定名，value是一个以逗号分隔的实现类名称列表：
`example.MyService=example.MyServiceImpl1,example.MyServiceImpl2`

SpringFactoriesLoader只有两个public方法：
-  [loadFactoryNames](https://docs.spring.io/spring/docs/5.0.0.RC3/javadoc-api/org/springframework/core/io/support/SpringFactoriesLoader.html#loadFactoryNames-java.lang.Class-java.lang.ClassLoader-) 通过给定的接口或抽象类的类型（Class），加载配置文件中所有实现类的完全限定名（全类名）； 
- [loadFactories](https://docs.spring.io/spring/docs/5.0.0.RC3/javadoc-api/org/springframework/core/io/support/SpringFactoriesLoader.html#loadFactories-java.lang.Class-java.lang.ClassLoader-) 通过给定的接口或抽象类的类型（Class），加载并实例化配置文件中所有实现类 ；

loadFactoryNames源码：
```
public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";
private static final Map<ClassLoader, MultiValueMap<String, String>> cache = new ConcurrentReferenceHashMap();

public static List<String> loadFactoryNames(Class<?> factoryClass, @Nullable ClassLoader classLoader) {
    String factoryClassName = factoryClass.getName();
    return (List)loadSpringFactories(classLoader).getOrDefault(factoryClassName, Collections.emptyList());
}

private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
    MultiValueMap result = (MultiValueMap)cache.get(classLoader);
    if(result != null) {
        return result;
    } else {
        try {
            Enumeration ex = classLoader != null?classLoader.getResources("META-INF/spring.factories"):ClassLoader.getSystemResources("META-INF/spring.factories");
            LinkedMultiValueMap result1 = new LinkedMultiValueMap();

            while(ex.hasMoreElements()) {
                URL url = (URL)ex.nextElement();
                UrlResource resource = new UrlResource(url);
                Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                Iterator var6 = properties.entrySet().iterator();

                while(var6.hasNext()) {
                    Entry entry = (Entry)var6.next();
                    List factoryClassNames = Arrays.asList(StringUtils.commaDelimitedListToStringArray((String)entry.getValue()));
                    result1.addAll((String)entry.getKey(), factoryClassNames);
                }
            }

            cache.put(classLoader, result1);
            return result1;
        } catch (IOException var9) {
            throw new IllegalArgumentException("Unable to load factories from location [META-INF/spring.factories]", var9);
        }
    }
}
```
代码并不难，但是它教会了我们**怎么从classpath下读取我们自己写的配置文件，不局限于Spring，也不局限于Properties文件**：
- 用`classLoader.getResources()`或`ClassLoader.getSystemResources()`,这两个方法的区别在于，前者用的是我们指定的ClassLoader，可以自定义加载路径；或者用的是加载这个类的ClassLoader的，搜索的path是这个项目的classpath
- 调用`PropertiesLoaderUtils.loadProperties()`，读取文件内容，并将其转为MultiValueMap。PropertiesLoaderUtils是Spring内部工具类，其实现就是传统的java读取Properties文件内容。用MultiValueMap保存数据的原因在于，spring.factories的value是一个以逗号分隔的实现类名称列表，且有多个文件，即一个key对应多个value，更重要的是，用map可以消除重复项。
- 用map的`getOrDefault(factoryClassName, Collections.emptyList())`返回对应的value。**用getOrDefault指定默认值为Collections.emptyList()，避免了返回null**
- **用ConcurrentReferenceHashMap实现缓存**。文件IO是一件十分耗时的工作，特别是对于读取大量的文件，所以我们有必要缓存下对应的Map。ConcurrentReferenceHashMap是Java7引进的，基于WeakHashMap实现的同步HashMap，同时解决了同步和因引用引起的内存溢出问题，是实现缓存的一个**简单安全**的方法。

loadFactories源码：
```
public static <T> List<T> loadFactories(Class<T> factoryClass, @Nullable ClassLoader classLoader) {
    Assert.notNull(factoryClass, "'factoryClass' must not be null");
    ClassLoader classLoaderToUse = classLoader;
    if (classLoaderToUse == null) {
        classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();
    }
    List<String> factoryNames = loadFactoryNames(factoryClass, classLoaderToUse);
    if (logger.isTraceEnabled()) {
        logger.trace("Loaded [" + factoryClass.getName() + "] names: " + factoryNames);
    }
    List<T> result = new ArrayList<>(factoryNames.size());
    for (String factoryName : factoryNames) {
        result.add(instantiateFactory(factoryName, factoryClass, classLoaderToUse));
    }
    AnnotationAwareOrderComparator.sort(result);
    return result;
}

private static <T> T instantiateFactory(String instanceClassName, Class<T> factoryClass, ClassLoader classLoader) {
    try {
        Class<?> instanceClass = ClassUtils.forName(instanceClassName, classLoader);
        if (!factoryClass.isAssignableFrom(instanceClass)) {
            throw new IllegalArgumentException(
                    "Class [" + instanceClassName + "] is not assignable to [" + factoryClass.getName() + "]");
        }
        return (T) ReflectionUtils.accessibleConstructor(instanceClass).newInstance();
    }
    catch (Throwable ex) {
        throw new IllegalArgumentException("Unable to instantiate factory class: " + factoryClass.getName(), ex);
    }
}
```
loadFactories方法比loadFactoryNames多了一个实例化的功能，所以首先会调用loadFactoryNames加载配置文件中对应接口或抽象类的所有实现类的完全限定名，接着逐一进行实例化，最后返回排列好的实例的集合。
我们具体看一下实例化的过程：
- 通过ClassUtils.forName()获取类名（String）对应的Class对象。[ClassUtils.forName](https://docs.spring.io/spring/docs/5.0.0.RC3/javadoc-api/org/springframework/util/ClassUtils.html#forName-java.lang.String-java.lang.ClassLoader-)是Class.forName的替代实现，它还返回基础数据类型以及数组类型的Class对象（如“int.class”），还可以解析内部类为通用的表达方式（例如 "java.lang.Thread.State", 而不是 "java.lang.Thread$State")。
- clazz..isAssignableFrom()与instanceof类似，只不过instanceof 针对的实例，而isAssignableFrom用来判断一个类Class1和另一个类Class2是否相同或是另一个类的超类或接口。 **在通过反射获取实例前，应先做类型检查。**
- 之后就是通过反射获取Class对象的构造器，然后实例化。
- 根据@Order 和 @Priority 注释（如果有的话），调用`AnnotationAwareOrderComparator.sort(result);`对实例进行排序。

> [AnnotationAwareOrderComparator](https://docs.spring.io/spring/docs/5.0.0.RC3/javadoc-api/org/springframework/core/annotation/AnnotationAwareOrderComparator.html)
AnnotationAwareOrderComparator 是 OrderComparator 的扩展, 它支持 Spring 的有序接口以及 @Order 和 @Priority 注释, 并具有一个由有序实例提供的、重写静态定义的注释值的顺序值 (如果有的话)。
