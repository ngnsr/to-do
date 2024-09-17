package com.rr.todo.service;

import com.rr.todo.dto.AddTaskDto;
import com.rr.todo.dto.ReorderDto;
import com.rr.todo.dto.Response;
import com.rr.todo.entity.Task;
import com.rr.todo.repo.ToDoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToDoService {
    private final ToDoRepository repository;

    public ToDoService(ToDoRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        return repository.findAllByOrderByOrderPos();
    }


    public Task addTask(AddTaskDto task) {
        long maxOrder = repository.findTopOrder().orElse(-1L);
        if(maxOrder != -1L){
            maxOrder++;
        }else maxOrder = 0;
        Task t = new Task();
        t.setDescription(task.getDescription());
        t.setOrderPos(maxOrder);
        return repository.save(t);
    }

    public List<Task> updateOrder(ReorderDto reorderDto) {
        if(reorderDto.getStartIndex() == reorderDto.getEndIndex()) {
            return repository.findAllByOrderByOrderPos();
        }

        final long minIndex = Math.min(reorderDto.getStartIndex(), reorderDto.getEndIndex());
        final long maxIndex = Math.max(reorderDto.getStartIndex(), reorderDto.getEndIndex());
        final List<Task> currentList = repository.findTaskByOrderPosBetween(minIndex, maxIndex);

        if(reorderDto.getStartIndex() < reorderDto.getEndIndex()){ // down
            for(Task t : currentList){
                if(t.getOrderPos() == reorderDto.getStartIndex()){
                   t.setOrderPos((long) reorderDto.getEndIndex());
                   continue;
                }
                long newPos = t.getOrderPos() - 1;
                t.setOrderPos(newPos >= 0 ? newPos : 0);
            }

        }else { // up
            for(Task t : currentList){
                if(t.getOrderPos() == reorderDto.getStartIndex()){
                    t.setOrderPos((long) reorderDto.getEndIndex());
                    continue;
                }
                long newPos = t.getOrderPos() + 1;
                t.setOrderPos(newPos >= 0 ? newPos : 0);
            }
        }
        repository.saveAll(currentList);
        var r = repository.findAllByOrderByOrderPos();
        return r;
    }

    public void toggleCompleted(Long id) {
        repository.findById(id).ifPresent(task -> {
            task.setCompleted(!task.getCompleted());
            repository.save(task);
        });
    }
}
