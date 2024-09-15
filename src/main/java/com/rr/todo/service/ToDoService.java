package com.rr.todo.service;

import com.rr.todo.dto.ReorderDto;
import com.rr.todo.entity.Task;
import com.rr.todo.repo.ToDoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ToDoService {
    private final ToDoRepository repository;

    public ToDoService(ToDoRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        return repository.findAllByOrderByOrderPos();
    }


    public Task addTask(Task task) {
        long maxOrder = repository.findTopOrder().orElse(-1L);
        if(maxOrder != -1L){
            maxOrder++;
        }else maxOrder = 0;
        task.setOrderPos(maxOrder);
        return repository.save(task);
    }

    public List<Task> updateOrder(ReorderDto reorderDto) {
        if(reorderDto.getStartIndex() == reorderDto.getEndIndex()) return repository.findAllByOrderByOrderPos();

        final long minIndex = Math.min(reorderDto.getStartIndex(), reorderDto.getEndIndex());
        final long maxIndex = Math.max(reorderDto.getStartIndex(), reorderDto.getEndIndex());
        final List<Task> currentList = repository.findTaskByOrderPosBetween(minIndex, maxIndex);

        System.out.println(currentList);

        // 0 3
        if(reorderDto.getStartIndex() < reorderDto.getEndIndex()){ // down
            for(Task t : currentList){
                if(t.getOrderPos() == reorderDto.getStartIndex()){
                   t.setOrderPos((long) reorderDto.getEndIndex());
                   continue;
                }
                long newPos = t.getOrderPos() - 1;
                long currentOrder = t.getOrderPos();
                t.setOrderPos(newPos >= 0 ? newPos : 0);
                System.out.println("change " + currentOrder + " to " + t.getOrderPos() );
            }

        }else { // up 3 0
            for(Task t : currentList){
                if(t.getOrderPos() == reorderDto.getStartIndex()){
                    t.setOrderPos((long) reorderDto.getEndIndex());
                    continue;
                }
                long newPos = t.getOrderPos() + 1;
                long currentOrder = t.getOrderPos();
                t.setOrderPos(newPos >= 0 ? newPos : 0);
                System.out.println("change " + currentOrder + " to " + t.getOrderPos() );

            }
        }
        repository.saveAll(currentList);
        var r = repository.findAllByOrderByOrderPos();
        System.out.println("result");
        System.out.println(r);
        return r;
    }

    public void toggleCompleted(Long id) {
        repository.findById(id).ifPresent(task -> {
            task.setCompleted(!task.getCompleted());
            repository.save(task);
        });
    }
}
