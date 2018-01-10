package com.zhuangqf.website.dao;

import com.zhuangqf.website.bean.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @author zhuangqf
 * @date 2018/1/9
 */
public interface CommentRepository extends MongoRepository<Comment,String> {

}
