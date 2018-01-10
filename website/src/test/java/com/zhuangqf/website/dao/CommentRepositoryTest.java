package com.zhuangqf.website.dao;

import com.zhuangqf.website.bean.Comment;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author zhuangqf
 * @date 2018/1/9
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class CommentRepositoryTest {

    @Resource
    private CommentRepository commentRepository;

    @Test
    public void saveComment(){
        Comment comment = new Comment();
        comment.setUser("zhuangqf");
        comment.setMessage("I love daidai");
        commentRepository.save(comment);
        List<Comment> result = commentRepository.findAll();
        for(Comment comment1:result){
            System.out.println(comment1.getUser()+","+comment1.getMessage());
        }
    }

}
