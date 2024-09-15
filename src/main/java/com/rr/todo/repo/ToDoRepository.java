package com.rr.todo.repo;

import com.rr.todo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ToDoRepository extends JpaRepository<Task, Long> {

    @Query("SELECT MAX(t.orderPos) FROM Task t")
    Optional<Long> findTopOrder();

    @Query("SELECT t.orderPos FROM Task t WHERE t.orderPos >= :a AND t.orderPos <= :b")
    List<Task> findTasksToReorder(Long a, Long b);

    List<Task> findTaskByOrderPosBetween(Long a, Long b);

    List<Task> findAllByOrderByOrderPos();

}
